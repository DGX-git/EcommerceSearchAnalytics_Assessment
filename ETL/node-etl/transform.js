export function transformData(records) {
  return records.map(r => ({
    search_id: r["Search ID"],

    customer_name: r["Customer Name"] || null,
    customer_email: r["Customer Email"] || null,

    ip_addresses: r["IP Address"]
      ? r["IP Address"].split(",").map(ip => ip.trim())
      : [],

    search_keyword: r["Search Keyword"] || null,
    brands: r["Brands"] || null,
    categories: r["Categories"] || null,
    collections: r["Collections"] || null,
    attributes: r["Attributes"] || null,

    min_price: r["Min Price"] ? Number(r["Min Price"]) : null,
    max_price: r["Max Price"] ? Number(r["Max Price"]) : null,
    min_rating: r["Min Rating"] ? Number(r["Min Rating"]) : null,

    total_results: r["Total Results"] ? Number(r["Total Results"]) : null,

    search_date: r["Search Date"]
      ? new Date(r["Search Date"]).toISOString()
      : null,
  }));
}
