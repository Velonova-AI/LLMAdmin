import { GlobeAltIcon, ShieldCheckIcon} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      {/*<ShieldCheckIcon  />*/}
      <p className="text-[34px] ">Neurosecure</p>
    </div>
  );
}
