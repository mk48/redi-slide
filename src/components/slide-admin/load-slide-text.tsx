import { actions } from "astro:actions";
import React, { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  url: string;
};

const LoadSlideText: React.FC<Props> = (props) => {
  const [slideContent, setSlideContent] = useState("");

  useEffect(() => {
    let isSubscribed = true;

    const fetchData = async () => {
      const { data, error } = await actions.getSlideContent({ slidePath: props.url });

      if (isSubscribed && data) {
        setSlideContent(data);
      }
    };

    fetchData().catch(console.error);

    return () => {
      isSubscribed = false;
    };
  }, [props.url]);

  return (
    <>
      <div>{props.url}</div>
      <Textarea value={slideContent} />
    </>
  );
};

export default LoadSlideText;
