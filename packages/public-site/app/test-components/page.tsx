'use client';

import { useState } from 'react';
import {
  Modal,
  FormInput,
  FormSelect,
  FormGroup,
  FormRow,
  FormButton,
  FormMessage,
  ModalTitle,
  JoinModal,
  InstructionsModal,
  H1,
  H2,
  SecondaryButton,
} from '@saa/shared/components/saa';

export default function TestComponentsPage() {
  // Modal states
  const [showBasicModal, setShowBasicModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showLargeModal, setShowLargeModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

  // Form state for demo
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setMessage({ type: 'success', text: 'Form submitted successfully!' });
    setIsSubmitting(false);

    // Reset after showing success
    setTimeout(() => {
      setMessage(null);
      setShowFormModal(false);
      setFormData({ firstName: '', lastName: '', email: '', country: '' });
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <H1 className="text-center mb-4">Component Test Page</H1>
        <p className="text-center text-[#9a9890] mb-12">
          Testing the new base Modal and Form components
        </p>

        {/* Modal Examples Section */}
        <section className="mb-16">
          <H2 className="mb-6">Modal Component</H2>
          <p className="text-[#9a9890] mb-6">
            Base modal with consistent styling, close button, escape key, click-outside, and scroll locking.
          </p>

          <div className="flex flex-wrap gap-4">
            <SecondaryButton as="button" onClick={() => setShowBasicModal(true)}>
              Basic Modal
            </SecondaryButton>
            <SecondaryButton as="button" onClick={() => setShowFormModal(true)} variant="green">
              Form Modal
            </SecondaryButton>
            <SecondaryButton as="button" onClick={() => setShowLargeModal(true)} variant="purple">
              Large Modal (xl)
            </SecondaryButton>
          </div>
        </section>

        {/* Pre-built Modals Section */}
        <section className="mb-16">
          <H2 className="mb-6">Pre-built Modals</H2>
          <p className="text-[#9a9890] mb-6">
            JoinModal and InstructionsModal - now built on the base Modal component.
          </p>

          <div className="flex flex-wrap gap-4">
            <SecondaryButton as="button" onClick={() => setShowJoinModal(true)}>
              JoinModal
            </SecondaryButton>
            <SecondaryButton as="button" onClick={() => setShowInstructionsModal(true)} variant="green">
              InstructionsModal
            </SecondaryButton>
          </div>
        </section>

        {/* Form Components Section */}
        <section className="mb-16">
          <H2 className="mb-6">Form Components (Inline Demo)</H2>
          <p className="text-[#9a9890] mb-6">
            FormInput, FormSelect, FormGroup, FormRow, FormButton, FormMessage
          </p>

          <div
            className="p-6 rounded-2xl max-w-md"
            style={{ background: '#151517', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <ModalTitle>Sample Form</ModalTitle>

            <form onSubmit={(e) => { e.preventDefault(); setMessage({ type: 'success', text: 'Demo form - no submission' }); }}>
              <FormRow>
                <FormGroup label="First Name" htmlFor="demo-firstName" required>
                  <FormInput
                    type="text"
                    id="demo-firstName"
                    name="firstName"
                    placeholder="John"
                  />
                </FormGroup>
                <FormGroup label="Last Name" htmlFor="demo-lastName" required>
                  <FormInput
                    type="text"
                    id="demo-lastName"
                    name="lastName"
                    placeholder="Doe"
                  />
                </FormGroup>
              </FormRow>

              <FormGroup label="Email" htmlFor="demo-email" required>
                <FormInput
                  type="email"
                  id="demo-email"
                  name="email"
                  placeholder="john@example.com"
                />
              </FormGroup>

              <FormGroup label="Country" htmlFor="demo-country" required>
                <FormSelect
                  id="demo-country"
                  name="country"
                  options={[
                    { value: 'US', label: 'United States' },
                    { value: 'CA', label: 'Canada' },
                    { value: 'UK', label: 'United Kingdom' },
                  ]}
                  placeholder="Select country"
                />
              </FormGroup>

              <div style={{ marginTop: '1.5rem' }}>
                <FormButton>Submit Demo</FormButton>
              </div>
            </form>
          </div>
        </section>

        {/* Size Variants Section */}
        <section>
          <H2 className="mb-6">Modal Size Variants</H2>
          <div className="text-[#9a9890] space-y-2">
            <p><code className="text-[#ffd700]">sm</code> - 400px max-width</p>
            <p><code className="text-[#ffd700]">md</code> - 500px max-width (default)</p>
            <p><code className="text-[#ffd700]">lg</code> - 640px max-width</p>
            <p><code className="text-[#ffd700]">xl</code> - 800px max-width</p>
            <p><code className="text-[#ffd700]">full</code> - 95vw max-width</p>
          </div>
        </section>
      </div>

      {/* MODALS */}

      {/* Basic Modal */}
      <Modal isOpen={showBasicModal} onClose={() => setShowBasicModal(false)} size="md">
        <ModalTitle subtitle="This is a basic modal using the new base Modal component.">
          Basic Modal
        </ModalTitle>
        <ul style={{ color: 'rgba(255,255,255,0.6)', paddingLeft: '1.25rem', marginBottom: '1.5rem' }}>
          <li>Close button positioned outside (top-right)</li>
          <li>Press Escape to close</li>
          <li>Click backdrop to close</li>
          <li>Page scroll is locked</li>
          <li>Header hides automatically</li>
        </ul>
        <FormButton onClick={() => setShowBasicModal(false)}>
          Got it!
        </FormButton>
      </Modal>

      {/* Form Modal */}
      <Modal isOpen={showFormModal} onClose={() => setShowFormModal(false)} size="md">
        <ModalTitle subtitle="Demonstrating form components inside a modal.">
          Form Modal Example
        </ModalTitle>

        <form onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup label="First Name" htmlFor="firstName" required>
              <FormInput
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup label="Last Name" htmlFor="lastName" required>
              <FormInput
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
          </FormRow>

          <FormGroup label="Email" htmlFor="email" required>
            <FormInput
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup label="Country" htmlFor="country" required>
            <FormSelect
              id="country"
              name="country"
              options={[
                { value: 'US', label: 'United States' },
                { value: 'CA', label: 'Canada' },
                { value: 'UK', label: 'United Kingdom' },
                { value: 'AU', label: 'Australia' },
              ]}
              placeholder="Select country"
              value={formData.country}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <div style={{ marginTop: '1.5rem' }}>
            <FormButton isLoading={isSubmitting} loadingText="Submitting...">
              Submit Form
            </FormButton>
          </div>

          {message && (
            <FormMessage type={message.type}>{message.text}</FormMessage>
          )}
        </form>
      </Modal>

      {/* Large Modal */}
      <Modal isOpen={showLargeModal} onClose={() => setShowLargeModal(false)} size="xl">
        <ModalTitle subtitle="This modal uses the xl size variant (800px max-width). Perfect for calculators, data tables, or multi-step wizards.">
          Large Modal (xl size)
        </ModalTitle>
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          padding: '2rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.5)'
        }}>
          [ Your complex content here ]
        </div>
        <FormButton onClick={() => setShowLargeModal(false)}>
          Close
        </FormButton>
      </Modal>

      {/* JoinModal */}
      <JoinModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onSuccess={(data) => {
          console.log('Join form submitted:', data);
          setShowJoinModal(false);
          setShowInstructionsModal(true);
        }}
      />

      {/* InstructionsModal */}
      <InstructionsModal
        isOpen={showInstructionsModal}
        onClose={() => setShowInstructionsModal(false)}
        userName="Test User"
      />
    </main>
  );
}
