function FAQ() {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
  
          <h2 className="text-4xl font-bold text-center">
            Frequently Asked Questions
          </h2>
  
          <div className="mt-12 space-y-6">
  
            <div className="p-6 border rounded-xl">
              <h3 className="font-semibold">
                Is my medical data secure?
              </h3>
  
              <p className="mt-2 text-gray-600">
                Yes. All reports are encrypted and securely stored.
              </p>
            </div>
  
            <div className="p-6 border rounded-xl">
              <h3 className="font-semibold">
                How long does verification take?
              </h3>
  
              <p className="mt-2 text-gray-600">
                Usually within 24–48 hours.
              </p>
            </div>
  
          </div>
  
        </div>
      </section>
    );
  }
  
  export default FAQ;