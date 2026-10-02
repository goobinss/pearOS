import { ArrowUpRight } from "lucide-react";
export function ContributorGuide({
  githubUrl,
  demo,
}: {
  githubUrl: string | null;
  demo: boolean;
}) {
  return (
    <section
      className="contributor-guide"
      aria-labelledby="contributor-guide-title"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">A GOOD FIRST CONTRIBUTION</p>
          <h2 id="contributor-guide-title">
            You don’t need to be a developer.
          </h2>
        </div>
        <a href="#getting-started" className="text-link">
          Read the quick guide
        </a>
      </div>
      <p>
        Community tasks can be completed with a document, images or screenshots.
        The X / Twitter and Discord proposals below need your ideas first; the
        owner reviews the plan and confirms rewards before assigning paid work.
      </p>
      {demo && (
        <p className="small muted">
          Community proposals are real planning requests. Cards marked DEMO show
          example rewards and cannot be claimed.
        </p>
      )}
      <details id="getting-started" className="getting-started">
        <summary>New to GitHub? Start here</summary>
        <ol>
          <li>
            <strong>Choose a task.</strong> Open its step-by-step instructions
            and download the plain-text proposal template. You can fill it in
            with any text editor.
          </li>
          <li>
            <strong>Create a free account.</strong>{" "}
            <a
              href="https://github.com/signup"
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              Sign up for GitHub <ArrowUpRight size={14} />
            </a>
            , then verify your email. You won’t need Git commands, a code editor
            or a pull request for community tasks.
          </li>
          <li>
            <strong>Introduce yourself.</strong> “Open proposal on GitHub” opens
            a prefilled conversation. Add a little about yourself and your plan,
            then click Submit new issue. For an already assigned task, use its
            existing conversation instead.
          </li>
          <li>
            <strong>Wait for confirmation.</strong> The owner confirms your
            assignment, scope and exact reward amount/asset before you begin
            paid work. Planning cards aren’t funded bounty offers.
          </li>
          <li>
            <strong>Share your work.</strong> Return to the same conversation,
            write a comment and attach your document or paste a link. Community
            deliverables do not require a pull request. The owner reviews them
            and may request changes before approval and manual payment.
          </li>
        </ol>
        <p className="small muted">
          A GitHub “issue” is simply a task conversation. If the link shows 404,
          ask the owner for repository access; contributors need read access and
          Issues must be enabled. Never put passwords or recovery codes in a
          public comment.
        </p>
        {githubUrl && (
          <a
            href={`${githubUrl}/issues`}
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            Browse task conversations <ArrowUpRight size={15} />
          </a>
        )}
      </details>
    </section>
  );
}
