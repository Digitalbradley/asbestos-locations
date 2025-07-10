import { useEffect } from "react";

interface AdSenseAdProps {
  adSlot: string;
  adFormat?: string;
  style?: React.CSSProperties;
  className?: string;
  responsive?: boolean;
}

export default function AdSenseAd({ 
  adSlot, 
  adFormat = "auto", 
  style = { display: "block" },
  className = "",
  responsive = true 
}: AdSenseAdProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      if (window.adsbygoogle && window.adsbygoogle.loaded) {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.log("AdSense error:", error);
    }
  }, []);

  return (
    <div className={`adsense-container ${className}`}>
      <ins 
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}