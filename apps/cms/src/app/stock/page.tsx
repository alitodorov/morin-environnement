import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { updateStatut } from './actions'

const STATUTS = [
  { value: 'en_stock',         label: '✅ En stock',          bg: '#E8F5E9', border: '#2E7D32', text: '#1B5E20' },
  { value: 'quantite_limitee', label: '⚠️ Qté limitée',       bg: '#FFF8E1', border: '#F57F17', text: '#E65100' },
  { value: 'rupture',          label: '❌ Rupture',            bg: '#FFEBEE', border: '#C62828', text: '#B71C1C' },
] as const

export default async function StockPage() {
  const payload = await getPayload({ config })

  // Vérification auth — seuls les admins Payload peuvent accéder
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) redirect('/admin/login?redirect=/stock')

  const { docs: sites } = await payload.find({
    collection: 'sites',
    limit: 20,
  })

  const { docs: granulats } = await payload.find({
    collection: 'granulats',
    limit: 100,
    depth: 1,
  })

  // Grouper par site
  const bySite = sites.map(site => ({
    site,
    produits: granulats.filter(g => {
      const siteRel = g.site
      if (typeof siteRel === 'object' && siteRel !== null) {
        return (siteRel as { id: number }).id === site.id
      }
      return siteRel === site.id
    }),
  }))

  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Gestion stock — MORIN</title>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                 background: #F5F5F5; color: #212121; }
          header { background: #1A237E; color: white; padding: 16px 24px;
                   display: flex; align-items: center; gap: 12px; }
          header h1 { font-size: 1.2rem; font-weight: 700; }
          header p  { font-size: 0.8rem; opacity: 0.75; margin-top: 2px; }
          .container { max-width: 900px; margin: 24px auto; padding: 0 16px; }
          .site-block { background: white; border-radius: 12px; margin-bottom: 24px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden; }
          .site-title { background: #E8EAF6; padding: 12px 20px; font-weight: 700;
                        font-size: 0.95rem; color: #1A237E; border-bottom: 1px solid #C5CAE9; }
          .produit { display: flex; align-items: center; padding: 14px 20px;
                     border-bottom: 1px solid #EEEEEE; gap: 12px; flex-wrap: wrap; }
          .produit:last-child { border-bottom: none; }
          .produit-info { flex: 1; min-width: 180px; }
          .produit-nom { font-weight: 600; font-size: 0.95rem; }
          .produit-meta { font-size: 0.8rem; color: #757575; margin-top: 2px; }
          .statut-btns { display: flex; gap: 8px; flex-wrap: wrap; }
          .btn { padding: 7px 14px; border-radius: 20px; border: 2px solid;
                 font-size: 0.82rem; font-weight: 600; cursor: pointer;
                 transition: all 0.15s; background: white; }
          .btn:hover { opacity: 0.85; transform: scale(1.03); }
          .btn.actif { color: white !important; }
          .empty { padding: 20px; color: #9E9E9E; font-size: 0.9rem; }
          .badge { display: inline-block; font-size: 0.72rem; padding: 2px 8px;
                   border-radius: 10px; font-weight: 600; margin-left: 8px; }
        `}</style>
      </head>
      <body>
        <header>
          <div>
            <h1>MORIN ENVIRONNEMENT — Gestion du stock</h1>
            <p>Cliquez sur un bouton pour changer la disponibilité d'un produit</p>
          </div>
        </header>

        <div className="container">
          {bySite.map(({ site, produits }) => (
            <div key={site.id} className="site-block">
              <div className="site-title">
                📍 {typeof site.nom === 'string' ? site.nom : `Site ${site.id}`}
                <span className="badge" style={{ background: '#C5CAE9', color: '#1A237E' }}>
                  {produits.length} produit{produits.length > 1 ? 's' : ''}
                </span>
              </div>

              {produits.length === 0 ? (
                <p className="empty">Aucun produit enregistré pour ce site.</p>
              ) : (
                produits.map(g => (
                  <div key={g.id} className="produit">
                    <div className="produit-info">
                      <div className="produit-nom">{g.nom}</div>
                      <div className="produit-meta">
                        {g.calibre} &nbsp;·&nbsp; {g.type === 'recycle' ? 'Recyclé' : 'Naturel'}
                        &nbsp;·&nbsp; {g.reference}
                      </div>
                    </div>

                    <div className="statut-btns">
                      {STATUTS.map(s => {
                        const actif = g.statut === s.value
                        return (
                          <form key={s.value} action={async () => {
                            'use server'
                            await updateStatut(g.id, s.value)
                          }}>
                            <button
                              type="submit"
                              className={`btn${actif ? ' actif' : ''}`}
                              style={{
                                borderColor: s.border,
                                backgroundColor: actif ? s.border : s.bg,
                                color: actif ? 'white' : s.text,
                              }}
                            >
                              {s.label}
                            </button>
                          </form>
                        )
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          ))}

          {bySite.every(b => b.produits.length === 0) && (
            <p style={{ textAlign: 'center', color: '#9E9E9E', marginTop: 40 }}>
              Aucun produit en base. Ajoutez-en via l'admin Payload.
            </p>
          )}
        </div>
      </body>
    </html>
  )
}
