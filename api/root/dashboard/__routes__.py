from flask_restful import Api
from .dashboard import Testing, RecurringTransaction

# Initialize API instance (if not already done elsewhere)
dashboard_api = Api()

# Register the `Testing` resource
dashboard_api.add_resource(Testing, "/testing")

# Register the `RecurringTransaction` resource
dashboard_api.add_resource(
    RecurringTransaction, 
    "/recurring-transactions",                      # For POST and GET operations
    "/recurring-transactions/<transaction_id>"       # For PATCH operations on specific transactions
)
