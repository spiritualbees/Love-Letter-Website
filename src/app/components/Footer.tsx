"use client";

import { useState } from "react";

const DISCLAIMER_TEXT =
  "This website was built with love by Sh1uSeZ, with coding assistance from AI. We aren't responsible for broken hearts or rejected dates! All music/links belong to their owners.";

const TOS_TEXT =
  "We believe in privacy. This website is 'Serverless'—we do not store your letters or personal data in any database. The letter data lives entirely inside the generated link. We only use anonymous counters to track total letters sent.";

function Modal({
  title,
  children,
  open,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 border-b border-rose-100">
          <h2 id="modal-title" className="text-lg font-semibold text-rose-800">
            {title}
          </h2>
        </div>
        <div className="p-4 sm:p-5 overflow-y-auto flex-1">
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            {children}
          </p>
        </div>
        <div className="p-4 sm:p-5 border-t border-rose-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-rose-500 text-white font-medium py-2.5 hover:bg-rose-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [tosOpen, setTosOpen] = useState(false);

  return (
    <>
      <footer className="mt-auto py-4 px-4 sm:px-6 text-center">
        <p className="text-xs sm:text-sm text-rose-600/90">
          <button
            type="button"
            onClick={() => setDisclaimerOpen(true)}
            className="underline hover:text-rose-700 transition"
          >
            Disclaimer
          </button>
          <span className="mx-2">·</span>
          <button
            type="button"
            onClick={() => setTosOpen(true)}
            className="underline hover:text-rose-700 transition"
          >
            Terms of Service
          </button>
        </p>
      </footer>

      <Modal
        title="Disclaimer"
        open={disclaimerOpen}
        onClose={() => setDisclaimerOpen(false)}
      >
        {DISCLAIMER_TEXT}
      </Modal>
      <Modal
        title="Terms of Service"
        open={tosOpen}
        onClose={() => setTosOpen(false)}
      >
        {TOS_TEXT}
      </Modal>
    </>
  );
}
