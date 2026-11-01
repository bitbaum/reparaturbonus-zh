#!/usr/bin/env bash
# The AccountKit import, rehearsed on a throwaway database the way the deploy
# runs it: 0000, a NextAuth-era snapshot, then 0001 twice (it must be
# re-runnable). Prints counts only.
#
#   DATABASE_URL=postgres://…/scratch bash scripts/db/rehearse-accountkit.sh
set -euo pipefail
: "${DATABASE_URL:?DATABASE_URL is required (a throwaway database)}"
q() { psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -qtA "$@"; }

q -f drizzle/0000_*.sql
for i in 1 2 3; do
  LEGACY_EMAIL="Rehearsal-$i@Example.test" LEGACY_PASSWORD="rehearsal password $i" \
    node scripts/db/seed-legacy-user.mjs >/dev/null
done
q -c 'INSERT INTO "users" ("id","email","password","updatedAt") VALUES ($$nopw$$,$$nopw@example.test$$,$$$$,now())'

for run in first second; do
  q --single-transaction -f drizzle/0001_accountkit_accounts.sql
  echo "after the $run apply: $(q -c 'SELECT count(*) FROM "users"') users," \
    "$(q -c 'SELECT count(*) FROM "auth_users"') shared accounts," \
    "$(q -c "SELECT count(*) FROM auth_accounts WHERE provider_id = 'credential'") passwords"
done

missing=$(q -c 'SELECT count(*) FROM "users" u LEFT JOIN "auth_users" a ON a.id = u.id WHERE a.id IS NULL')
drift=$(q -c "SELECT count(*) FROM users u JOIN auth_accounts c ON c.user_id = u.id AND c.provider_id = 'credential' WHERE c.password IS DISTINCT FROM u.password")
mixed=$(q -c 'SELECT count(*) FROM "auth_users" WHERE email <> lower(email)')
echo "not imported: $missing, hash changed: $drift, addresses not lower-cased: $mixed"
[ "$missing" = 0 ] && [ "$drift" = 0 ] && [ "$mixed" = 0 ]

# The cutover mirror: someone the old server registers after 0001 ran.
LEGACY_EMAIL="late@example.test" LEGACY_PASSWORD="late password" node scripts/db/seed-legacy-user.mjs >/dev/null
late=$(q -c "SELECT count(*) FROM auth_users a JOIN auth_accounts c ON c.user_id = a.id AND c.provider_id = 'credential' WHERE a.email = 'late@example.test'")
echo "registered during the cutover and mirrored: $late"
[ "$late" = 1 ]

# A case-variant address registered by the old server during the cutover is
# not given anyone's account, and does not break that registration.
q -c "INSERT INTO users (id,email,password,\"updatedAt\") VALUES ('late2','LATE@example.test','x',now())"
echo "a case-variant address during the cutover registers and is not mirrored: $(q -c "SELECT count(*) FROM auth_users WHERE id = 'late2'") shared accounts"

# Two addresses that collide once lower-cased stop the import (on a database
# the import has not run on yet).
q -c 'DROP TRIGGER "users_accountkit_mirror" ON "users"'
q -c 'DROP TABLE auth_accounts, auth_passkeys, auth_sessions, auth_two_factors, auth_verifications, auth_users'
q -c 'TRUNCATE "users" CASCADE'
q -c "INSERT INTO users (id,email,password,\"updatedAt\") VALUES ('a','dup@example.test','x',now()),('b','DUP@example.test','x',now())" >/dev/null 2>&1 \
  || { echo "collision fixture could not be written" >&2; exit 1; }
if q --single-transaction -f drizzle/0001_accountkit_accounts.sql 2>/dev/null; then
  echo "FAIL: colliding addresses were imported" >&2; exit 1
fi
echo "colliding addresses refuse the import: ok"
