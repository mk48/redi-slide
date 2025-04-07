import { actions } from "astro:actions";
import React, { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Props = {
  url: string;
};

const LoadSlideText: React.FC<Props> = (props) => {
  const [slideContent, setSlideContent] = useState("");
  const [msg, setMsg] = useState("");

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

  const onContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSlideContent(e.target.value);
  };

  const onSave = async () => {
    setMsg("");
    const { data, error } = await actions.saveSlideContent({ slidePath: props.url, content: slideContent });
    if (error) {
      setMsg("error in saving");
    } else {
      setMsg("saved successfully");
    }
  };

  return (
    <>
      <div>{props.url}</div>
      <Textarea rows={30} value={slideContent} onChange={onContentChange} />
      <Button onClick={onSave}>Save</Button>
    </>
  );
};

export default LoadSlideText;
