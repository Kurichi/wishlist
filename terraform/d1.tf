resource "cloudflare_d1_database" "wishlist" {
  account_id            = var.cloudflare_account_id
  name                  = "${var.project_name}-db"
  primary_location_hint = "apac"
}
