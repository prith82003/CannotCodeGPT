import { UserButton } from "@clerk/nextjs";
import { CoinsIcon, LayoutGrid, PiggyBank, ReceiptText, Bitcoin} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import Link from "next/link";

function SideNav() {
  const menuList = [
    {
      id: 1,
      name: "Dashboard",
      icon: LayoutGrid,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Budgets",
      icon: PiggyBank,
      path: "/dashboard/budgets",
    },
    {
      id: 3,
      name: "Expenses",
      icon: ReceiptText,
      path: "/dashboard/expenses",
    },
    {
      id: 4,
      name: "Donations",
      icon: CoinsIcon,
      path: "/dashboard/donations",
    },
    {
      id: 5,
      name: "Gambling",
      icon: Bitcoin,
      path: "/dashboard/gambling",
    }
  ];
  const path = usePathname();
  useEffect(() => {
    console.log(path);
  }, [path]);
  return (
    <div className="h-screen p-5 border shadow-sm">
      <Image src={"/logo.svg"} alt="logo" width={80} height={80} />
      <div className="mt-5">
        {menuList.map((menu, index) => (
          <Link href={menu.path} key={menu.id}>
            <h2
              className={`flex gap-2 items-center 
                    text-gray-500 font-medium p-5 
                    mb-2
                    cursor-pointer rounded-md 
                    hover:text-primary hover:bg-muted
                    ${path == menu.path && "text-primary bg-muted"}
                    `}
            >
              <menu.icon />
              {menu.name}
            </h2>
          </Link>
        ))}
      </div>
      <div
        className="fixed bottom-10 p-5 flex gap-2
            items-center"
      >
        <UserButton />
        Profile
      </div>
    </div>
  );
}

export default SideNav;
