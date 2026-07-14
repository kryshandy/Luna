import sentry_sdk
import os

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN_AI"),
    traces_sample_rate=1.0,
    environment=os.getenv("ENV", "development"),
)
