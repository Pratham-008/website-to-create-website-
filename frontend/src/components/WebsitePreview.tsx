import { WebContainer } from '@webcontainer/api';
import React, { useEffect, useState } from 'react';

interface PreviewFrameProps {
  files: any[];
  webContainer: WebContainer;
}

export function WebsitePreview({ files, webContainer }: PreviewFrameProps) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    let isCancelled = false;

    const runProject = async () => {
      try {
        // Step 1: Register server-ready listener first
        const handleReady = (port: number, serverUrl: string) => {
          if (!isCancelled) {
            console.log("✅ Server ready on:", serverUrl);
            setUrl(serverUrl);
          }
        };
        webContainer.on('server-ready', handleReady);

        // Step 2: Install dependencies
        const installProcess = await webContainer.spawn('npm', ['install']);
        installProcess.output.pipeTo(new WritableStream({
          write(data) {
            console.log("[npm install]", data);
          }
        }));
        await installProcess.exit;

        // Step 3: Run dev server
        const devProcess = await webContainer.spawn('npm', ['run', 'dev']);
        devProcess.output.pipeTo(new WritableStream({
          write(data) {
            console.log("[npm run dev]", data);
          }
        }));
        // Optional: await devProcess.exit; (you usually don't want this)

      } catch (err) {
        console.error("❌ Error running project:", err);
      }
    };

    runProject();

    return () => {
      isCancelled = true;
    };
  }, [webContainer]);

  return (
    <div className="h-full flex items-center justify-center text-gray-400">
      {!url ? (
        <div className="text-center">
          <p className="mb-2">Loading...</p>
        </div>
      ) : (
        <iframe width="100%" height="100%" src={url} title="Web Preview" />
      )}
    </div>
  );
}
