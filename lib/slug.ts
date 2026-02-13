export function createSlug(product: any) {

  const name =
    `${product.brand} ${product.title} ${product.width}-${product.profile}R${product.diameter}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

  return `${name}-${product.id}`
}
