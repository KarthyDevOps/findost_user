const ROLE_TYPE = {
    SUPER_ADMIN: "SUPER ADMIN",
    ADMIN: "ADMIN",
    STAFF: "STAFF",
    SUB_Admin: "SUB ADMIN",
  };
  

  const PROFESSIONAL_DOCUMENT = {
    MANAGER: "MANAGER",
    ASSISTENT: "ASSISTENT INSURANCE AGENT",
    INSURANCE: "INSURANCE AGENT",
    REGIONAL: "REGIONAL_OFFICER",
    AUTHORIZED_PERSON : "AUTHORIZED PERSON",
    OTHER:"OTHER"
  };
  const ORDER_STATUS = {
    'currency':'INR',
    
  };
  
  const PAYMENT_ENTITY = ['payment.authorized', 'payment.captured', 'payment.failed', 'payment.pending', 'payment.cancelled', 'payment_link.paid', 'payment_link.expired', 'payment_link.cancelled']
  const REFUND_ENTITY = ['refund.processed', 'refund.failed']
  const PAYMENT_STATUS = {
    'COMPLETED': 'COMPLETED',
    'PENDING': 'PENDING',
    'FAILURE': 'FAILURE'
  };
  module.exports = {
      ROLE_TYPE,
      PROFESSIONAL_DOCUMENT,
      PAYMENT_ENTITY,
      REFUND_ENTITY,
      PAYMENT_STATUS,
      ORDER_STATUS
  }