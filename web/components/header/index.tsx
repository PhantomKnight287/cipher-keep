import { ShieldCheck } from "lucide-react";
import HeaderLinks from "./index.client";
import Link from "next/link";

function Header() {
  return (
    <header className="flex flex-row mt-5 mb-6 w-full">
      <div className="container flex flex-row">
        <Link href="/" className="flex flex-row items-center">
          <ShieldCheck />
          <div className="font-semibold leading-3 ml-1">
            Cipher
            <br />
            <div className="w-full h-1" />
            Keep
          </div>
        </Link>
        <HeaderLinks />
      </div>
    </header>
  );
}

export default Header;
