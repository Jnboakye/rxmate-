// components/FAQSection.tsx
'use client'

import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

const faqs = [
  {
    question: 'Do I need to renew my subscription annually?',
    answer:
      'Yes. Your subscription is valid only for the current exam year. Once the exam period concludes, the subscription expires automatically.',
  },
  {
    question: 'Can I access my account on multiple devices?',
    answer:
      'You may use up to two devices per account. If you log in from a new device, the oldest active session will be logged out automatically.',
  },
  {
    question: 'How do I report an error in content or functionality?',
    answer: (
      <>
        <p>
          Please email us at <strong>akowuahnimoh@gmail.com</strong> with:
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>A detailed description of the mistake.</li>
          <li>Relevant screenshots.</li>
          <li>Credible references (e.g., textbooks, guidelines) supporting your report.</li>
        </ul>
      </>
    ),
  },
]

export default function FaqSection() {
  return (
    <section id="faqs" className="max-w-2xl mx-auto px-4 py-16 font-openSauce">
      <h2 className="text-3xl font-bold text-center mb-2">Your Questions, Answered</h2>
      <p className="text-center text-gray-500 mb-10">
        We&apos;re here to help you learn how to use the Rxmate platform and answer any questions you may have.
      </p>

      <h3 className="text-xl font-semibold mb-4">General</h3>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <Disclosure key={index}>
            {({ open }) => (
              <div className="border border-gray-200 bg-[#FBFBFB] rounded-xl px-4 py-3">
                <Disclosure.Button className="flex justify-between w-full text-left font-400 text-[#000000CC]">
                  {faq.question}
                  <ChevronDownIcon
                    className={`w-5 h-5 transform transition-transform duration-200 ${
                      open ? 'rotate-180' : ''
                    }`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="mt-2 text-[#00000099] text-sm">{faq.answer}</Disclosure.Panel>
              </div>
            )}
          </Disclosure>
        ))}
      </div>
    </section>
  )
}
