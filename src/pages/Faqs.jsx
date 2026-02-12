import React, { useState } from "react";

const faqs = [
  {
    question: "How do I place an order?",
    answer: "Browse the collection, add items to your cart, and continue to checkout. Login is required only when you place the order.",
  },
  {
    question: "What kinds of products do you list?",
    answer: "Our catalog includes artwork, refurbished items, and other curated products. Inventory updates regularly.",
  },
  {
    question: "Are refurbished products quality checked?",
    answer: "Yes. Refurbished listings are reviewed for condition and core functionality before being published.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We support major online payment methods, and availability of COD depends on item and location.",
  },
  {
    question: "Can I return or exchange items?",
    answer: "Return eligibility depends on the product type and listing policy. Please review the return policy for details.",
  },
];

const Faqs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8 text-primary-dull">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left flex justify-between items-center"
            >
              <span className="font-medium text-gray-800">{faq.question}</span>
              <span className="text-xl">{activeIndex === index ? "-" : "+"}</span>
            </button>
            {activeIndex === index && (
              <p className="mt-3 text-gray-600 text-sm">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faqs;
