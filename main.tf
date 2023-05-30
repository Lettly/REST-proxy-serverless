terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.66.0"
    }
  }
}

provider "google" {
  credentials = file("/home/marco/.gcp/rest-proxy-serverless-dc4d6deb33fb.json")

  project = "rest-proxy-serverless"
  region  = "europe-west3"
}

resource "google_storage_bucket" "bucket" {
  name     = "rest-proxy-serverless-bucket"
  location = "EU"
}

data "archive_file" "function_proxy" {
  type             = "zip"
  source_file      = "${path.module}/functions/proxy/function.js"
  output_file_mode = "0666"
  output_path      = "${path.module}/.files/function_proxy.js.zip"
}

resource "google_storage_bucket_object" "archive" {
  name   = "function_proxy.js.zip"
  bucket = google_storage_bucket.bucket.name
  source = data.archive_file.function_proxy.output_path
}

resource "google_cloudfunctions_function" "function" {
  name        = "function-proxy"
  description = "My function"
  runtime     = "nodejs16"

  available_memory_mb   = 128
  source_archive_bucket = google_storage_bucket.bucket.name
  source_archive_object = google_storage_bucket_object.archive.name
  trigger_http          = true
  entry_point           = "helloWorld"
}

# IAM entry for all users to invoke the function
resource "google_cloudfunctions_function_iam_member" "invoker" {
  project        = google_cloudfunctions_function.function.project
  region         = google_cloudfunctions_function.function.region
  cloud_function = google_cloudfunctions_function.function.name

  role   = "roles/cloudfunctions.invoker"
  member = "allUsers"
}
