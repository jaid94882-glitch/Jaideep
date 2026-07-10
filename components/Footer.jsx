export default function Footer() {
  return (
    <footer className="bg-brand-dark text-blue-200 px-5 py-10 pb-28 md:pb-10">
      <div className="mx-auto max-w-5xl text-center md:flex md:items-center md:justify-between md:text-left">
        <div>
          <p className="text-white font-bold text-lg">MR Lead Portal</p>
          <p className="mt-1 text-xs">
            Connecting Medical Representatives, Doctors &amp; Lenders.
          </p>
        </div>
        <div className="mt-4 md:mt-0 text-[11px] space-y-1">
          <p>🔒 All documents are encrypted and shared only with verified lending partners.</p>
          <p>Loans are subject to credit approval by RBI-registered lenders.</p>
          <p>© {new Date().getFullYear()} MR Network Lending. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
