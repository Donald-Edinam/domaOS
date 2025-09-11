import { cn } from "@/lib/utils";
import { StickToBottom } from "use-stick-to-bottom";
import { DomaScrollbars } from "./overlay-scrollbars";

export type ChatContainerRootProps = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export type ChatContainerContentProps = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export type ChatContainerScrollAnchorProps = {
  className?: string;
  ref?: React.RefObject<HTMLDivElement>;
} & React.HTMLAttributes<HTMLDivElement>;

function ChatContainerRoot({
  children,
  className,
  ...props
}: ChatContainerRootProps) {
  return (
    <DomaScrollbars
      className={cn("flex", className)}
      options={{
        overflow: { x: "hidden", y: "scroll" },
        scrollbars: { autoHide: "move", autoHideDelay: 1000 },
      }}
      {...props}
    >
      <StickToBottom
        className="flex w-full"
        resize="smooth"
        initial="instant"
        role="log"
      >
        {children}
      </StickToBottom>
    </DomaScrollbars>
  );
}

function ChatContainerContent({
  children,
  className,
  ...props
}: ChatContainerContentProps) {
  return (
    <StickToBottom.Content
      className={cn("flex w-full flex-col", className)}
      {...props}
    >
      {children}
    </StickToBottom.Content>
  );
}

function ChatContainerScrollAnchor({
  className,
  ...props
}: ChatContainerScrollAnchorProps) {
  return (
    <div
      className={cn("h-px w-full shrink-0 scroll-mt-4", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export { ChatContainerRoot, ChatContainerContent, ChatContainerScrollAnchor };
