# Brief: Building a Regional Prospect List for Oz Oils

## Purpose

This brief outlines practical options for building a targeted list of retail, commercial and institutional establishments in South East Queensland and Northern NSW that may use cooking oil and therefore may be relevant prospects for Oz Oils. This is not the final technical solution; it is a strategic brief describing suitable data sources, collection methods, enrichment options, Apify usage and compliance considerations.

Based on the Oz Oils website, Oz Oils Pty Ltd is a family-owned Australian company established in 2014, with more than 30 years' experience in the used cooking oil industry. The business offers free used cooking oil collection, scheduled pickup, storage units, cooking oil recycling and delivery of fresh Australian-made cooking oil, including canola, vegetable and cottonseed oil. Their target customers include cafes, restaurants, takeaways, factories, food trucks, hotels and other food businesses. Their service area includes South East Queensland and Northern NSW, with locations named on the site including Brisbane, Gold Coast, Sunshine Coast, Noosa Heads, Ipswich, Toowoomba, Warwick, Goondiwindi and Byron Bay.

The intended prospect list should identify businesses that either generate used cooking oil, purchase fresh cooking oil, or both. A useful final dataset would include business name, category, address, suburb, postcode, latitude/longitude, phone number, website, email address where available, contact form URL, source, source URL, confidence score and notes on likely cooking-oil usage.

## Excluded Sources

For this brief, the following options are intentionally excluded:

- OpenStreetMap / Overpass data
- Manual review or VA-led research as a primary method
- Purchased or brokered business lists

This means the recommended approach focuses on API-driven, scraper-driven and semi-automated sources that can be tested, documented and scaled.

## Option 1: Google Places API

Google Places is likely the strongest foundation for the core business-location database. It can be used to search by region, suburb, radius and category. Relevant categories include restaurants, cafes, takeaways, bakeries, supermarkets, bars, pubs, hotels, caterers and food manufacturers where available.

Google Places can usually provide business name, formatted address, phone number, website, category, opening hours, rating, review count, Google Place ID and coordinates. The major limitation is that it generally does not provide email addresses. However, the website field creates the pathway into a second-stage email discovery process.

This option is best for building a reliable baseline of operating businesses. The Google Place ID also helps deduplicate records. The main downsides are API cost, usage limits and the need to design suburb or grid searches carefully to avoid missing businesses or creating many duplicates.

## Option 2: Apify for Google Maps and Place Discovery

Because Apify is already part of the working environment, it should be incorporated into the pilot. Apify has actors for Google Maps scraping, business discovery, website crawling and contact-detail extraction. It could be used instead of Google Places for a quick test, or alongside Google Places as a faster prototyping layer.

Example Apify search inputs could include:

- `restaurant Brisbane`
- `fish and chips Gold Coast`
- `cafe Sunshine Coast`
- `takeaway Ipswich`
- `bakery Toowoomba`
- `caterer Noosa`
- `food truck Brisbane`
- `commercial kitchen Brisbane`

Apify can export structured datasets and support scheduled runs, webhooks and downstream automation. It is especially useful for rapidly testing which categories and locations produce the best prospect density. The caution is that each source's terms should be checked, and scraping should be controlled rather than aggressive.

## Option 3: Council Food Business Registers

Council food business licensing data is highly relevant because businesses preparing or selling food generally require approvals. Relevant councils may include Brisbane, Gold Coast, Logan, Ipswich, Moreton Bay, Redland, Sunshine Coast, Noosa, Scenic Rim, Lockyer Valley, Somerset and Toowoomba, plus Northern NSW councils for Byron Bay and Tweed if required.

Availability will vary. Some councils may publish searchable food business registers; others may provide limited public information or require a formal request. These sources may include business names, premises addresses, licence categories and sometimes licence holders. They are unlikely to provide direct emails.

This option is useful as a validation and coverage source. It may identify food premises that do not appear strongly in Google-style search results, such as small takeaways, school canteens, clubs, local kitchens and food operators.

## Option 4: ABR / ABN Lookup Enrichment

ABN Lookup should not be treated as the main discovery source, but it can help enrich and validate records after businesses have been found. Once a trading name and address are known, ABN Lookup may help identify the legal entity, ABN status, GST registration, entity type and postcode-level location.

This is useful for data hygiene and future sales workflows. It may help distinguish single-location operators from companies, franchises or larger groups. However, ABR data usually will not provide emails or exact shopfront details, so it should be an enrichment layer rather than the main source.

## Option 5: Online Directories via Apify

Apify can also collect data from selected online directories such as business directories, local tourism directories, shopping-centre tenant directories and industry-specific food directories. These sources may provide additional phones, websites, categories, emails or contact-page links.

Directory data should be secondary because it can be stale and duplicative. Its best use is to find categories that may be inconsistent in Google, such as caterers, clubs, function centres, school canteens, food manufacturers and accommodation venues with commercial kitchens. The pilot should test a short list of approved directories and only retain those that provide unique, accurate records.

## Option 6: Delivery Platform Discovery via Apify

Delivery platforms can identify active restaurants and takeaway businesses. These are often strong cooking-oil users, especially fried chicken, fish and chips, burgers, Asian takeaway, pizza, kebabs and similar quick-service categories.

If acceptable under source terms, Apify could collect restaurant names, cuisine type, suburb and platform URLs. This should be treated as an enrichment signal rather than the primary record. For example, if a business appears on a delivery platform and also appears in Google Places, it could receive a higher oil-use likelihood score.

## Option 7: Website and Email Extraction

Email discovery should happen after location discovery. Once a website is found, Apify or a custom crawler can visit the homepage, contact page, about page, catering/functions page and footer to extract generic business emails such as `info@`, `hello@`, `admin@`, `orders@`, `catering@`, `functions@` and `contact@`.

Where no email is visible, the system should capture the contact form URL instead. Each record should store where the email was found, the date collected and a confidence score. Generic business emails should be preferred over personal emails.

## Option 8: Email Validation

Extracted emails should be validated using a service such as Hunter, Snov, NeverBounce, ZeroBounce or similar. The aim is to reduce bounces and confirm deliverability, not to create a risky personal-contact database. Useful validation fields include status, provider, confidence and validation date.

## Recommended Pilot

A sensible pilot would target one dense service area first, such as Brisbane or the Gold Coast. The pilot should use Google Places and/or Apify Google Maps scraping for discovery, council data for validation, website scraping for emails, ABN Lookup for enrichment and an email validation tool for deliverability checks.

High-likelihood segments should include fish and chips, fried chicken, Asian takeaway, burgers, pubs, clubs, bakeries, caterers, cafes with kitchens, hotels, food trucks and commercial kitchens. The pilot output should be a clean CSV or CRM-ready dataset with deduplication, source tracking and oil-use scoring.

## Compliance Considerations

If the list is used for outreach, the Spam Act 2003 and Australian privacy expectations matter. The process should prioritise business-relevant contacts, generic business emails, clear source tracking, proper sender identification and an unsubscribe mechanism. Scraping should respect source terms, robots.txt where relevant, and reasonable collection limits.

## Conclusion

A strong prospect-building system for Oz Oils is achievable without OpenStreetMap, manual review or bought lists. The recommended model is a staged pipeline: discover businesses through Google Places and/or Apify, validate with council food-business sources, enrich with ABN Lookup, extract emails from websites, validate deliverability, then score each prospect by likely cooking-oil usage. Apify can play a central role in prototyping and automating the collection layers before a final production workflow is designed.
