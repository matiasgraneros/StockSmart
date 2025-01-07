import { NavLink } from 'react-router-dom';

interface InventoryInfoCardTypes {
  info: string;
  number: number;
  to: string;
}

export default function InventoryInfoCard({
  info,
  number,
  to,
}: InventoryInfoCardTypes) {
  return (
    <NavLink
      to={to}
      className="flex h-14 items-center justify-around md:h-20 md:flex-col md:items-start md:justify-evenly md:pl-4 bg-olivine-50 border-olivine-200 rounded-md shadow-sm border text-olivine-950 hover:bg-olivine-200 hover:border-olivine-300 active:bg-olivine-300"
    >
      <p className="text-olivine-950 text-base">{info}</p>
      <h3 className="text-olivine-950 text-xl font-semibold">{number}</h3>
    </NavLink>
  );
}
