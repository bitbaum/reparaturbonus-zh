import Link from 'next/link';
import { Search } from 'lucide-react';
import { ROUTES } from '@/lib/constants/routes';

export default function BrowseWorkshops() {
  return (
    <section className="bg-surface-alt border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-text mb-3">Oder durchsuchen Sie alle Werkstätten</h2>
        <p className="text-text-muted mb-6">
          Entdecken Sie alle beteiligten Reparaturwerkstätten in Zürich
        </p>
        <Link
          href={ROUTES.SHOPS}
          className="inline-flex items-center bg-surface text-brand px-6 py-3 rounded-btn font-medium hover:bg-bg transition-colors border border-brand"
        >
          <Search className="h-5 w-5 mr-2" />
          Alle Werkstätten anzeigen
        </Link>
      </div>
    </section>
  );
}
