import { useEffect, useRef } from "react";
import autoAnimate from "@formkit/auto-animate";

export function MessageStack({ messages }: { messages: string[] }) {
  const parent = useRef(null);

  useEffect(() => {
    if (parent.current) {
      autoAnimate(parent.current);
    }
  }, [parent]);

  return (
    <div ref={parent} className="flex flex-col space-y-2">
      {messages.slice(-3).map((message, index) => (
        <div
          key={message + index}
          className="bg-gray-100 p-2 rounded overflow-hidden text-ellipsis whitespace-nowrap"
          title={message}
        >
          {message}
        </div>
      ))}
    </div>
  );
}
