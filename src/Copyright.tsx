// copyright - aria is a last resort
interface CopyrightProps {
  isVisible: boolean;
}

export default function Copyright({ isVisible }: CopyrightProps) {
  return (
    <div
      className={`flex justify-end text-xs font-semibold fixed bottom-1 right-2 p-1 ${
        isVisible ? "opacity-50" : "opacity-0"
      }`}
    >
      <a
        href="https://www.linkedin.com/in/yurii-boblak/"
        target="_blank"
        rel="noopener noreferrer"
      >
        YB © 2025
      </a>
    </div>
  );
}
