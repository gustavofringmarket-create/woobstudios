import Image from "next/image";

export default function VerifiedBadge({ size = 18 }: { size?: number }) {
  return (
    <Image
      src="/verified.png"
      alt="Verified"
      width={size}
      height={size}
      className="shrink-0"
    />
  );
}
