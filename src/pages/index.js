import Github from "../components/Github";
import Nav from "../components/Nav";
import Style from "../components/Style";
import UserInput from "../components/UserInput";
import { useRef, useState } from "react";
import Typewriter from "react-typewriter-animate";
import randomBlurb from "../utils/randomBlurb";
import Caption from "../components/Caption";
import Link from "next/link";

export default function Home() {
  const styles = ["Funny", "Creative", "Informative", "Quirky", "Robotic"];
  const [loading, setLoading] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(styles[0]);
  const [text, setText] = useState("");
  const [generatedCaptions, setGeneratedCaptions] = useState("");
  const [blurb, setBlurb] = useState("");
  const captionsRef = useRef(null);

  const prompt = `Generate 2 ${selectedStyle} Instagram captions using no hashtags and clearly label them "1." and "2.". ${
    selectedStyle === "Funny" && "Be funny and humorous, utilize jokes."
  } ${
    selectedStyle === "Creative" &&
    "Be creative and clever, utilize puns and rhyme."
  }
  ${
    selectedStyle === "Robotic" &&
    "Be robotic and impersonal, do not use any emotion."
  }
  ${
    selectedStyle === "Informative" &&
    "Be informative and educational. Insert facts and statistics."
  }
      ${
        selectedStyle === "informative"
          ? "Do not generate a caption that is more than 20 words"
          : "Do not generate a caption that is more than 10 words"
      }, and base them on this description: ${text}${
    text.slice(-1) === "." ? "" : "."
  }`;

  async function generateCaption(e) {
    e.preventDefault();
    if (text.length === 0) return;
    //Reset previously generated captions
    setGeneratedCaptions("");
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    let newBlurb = randomBlurb();
    setBlurb(newBlurb);

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedCaptions((prev) => prev + chunkValue);
    }
    if (captionsRef.current !== null) {
      captionsRef.current.scrollIntoView({ behavior: "smooth" });
    }

    setLoading(false);
  }

  return (
    <>
      <Nav />
      <div className="w-full h-full flex flex-col items-center">
        <main className="w-full h-full p-4 sm:p-6 lg:py-12 xl:py-24 flex flex-col gap-8 lg:gap-12 items-center">
          <Github />
          <h1 className="text-center font-bold text-3xl xl:text-4xl h-full">
            Generate the perfect{" "}
            <Typewriter
              cursor={{ char: " " }}
              timeBeforeDelete={2000}
              loop
              dataToRotate={[
                [{ type: "word", text: ` Instagram` }],
                [{ type: "word", text: ` Facebook` }],
                [{ type: "word", text: ` Youtube` }],
                [{ type: "word", text: ` Twitter` }],
              ]}
            />
            caption with the help of ChatGPT
          </h1>
          <ul className="flex flex-col gap-8">
            <li className="flex flex-col gap-2">
              <div className="flex flex-row gap-2 text-sm xl:text-base items-start sm:items-center">
                <span className="w-5 h-5 xl:w-6 xl:h-6 rounded-full font-bold text-xs xl:text-sm bg-black flex-shrink-0 flex items-center justify-center text-white">
                  1
                </span>
                <p>
                  Describe <strong>relevant things in your post</strong> that
                  you&apos;d like in your caption.
                </p>
              </div>
              <UserInput text={text} setText={setText} />
            </li>
            <li className="flex flex-col gap-2">
              <div className="flex flex-row gap-2 text-sm xl:text-base items-start sm:items-center">
                <span className="w-5 h-5 xl:w-6 xl:h-6 rounded-full font-bold text-xs xl:text-sm bg-black flex-shrink-0 flex items-center justify-center text-white">
                  2
                </span>
                <p>
                  Choose your <strong>desired caption style</strong>.
                </p>
              </div>
              <Style
                styles={styles}
                selectedStyle={selectedStyle}
                setSelectedStyle={setSelectedStyle}
              />
            </li>
          </ul>
          <button
            onClick={(e) => generateCaption(e)}
            disabled={loading}
            className={`${
              loading && "animate-pulse"
            } disabled:brightness-90 disabled:cursor-not-allowed text-base xl:text-lg bg-gradient-to-br from-red-500 to-purple-500 hover:hue-rotate-[-90deg] duration-200 transition ease-linear px-3 py-2 rounded-xl font-bold text-white w-full whitespace-nowrap max-w-sm`}
          >
            {loading ? "Generating..." : "Generate your caption →"}
          </button>
          {generatedCaptions.length > 0 && (
            <section
              ref={captionsRef}
              className="flex flex-col gap-4 w-full items-center"
            >
              <h3 className="text-center font-bold text-xl xl:text-2xl">
                {blurb}
              </h3>
              {generatedCaptions
                .substring(3)
                .split("2. ")
                .map((caption, key) => {
                  return <Caption text={caption} key={key} />;
                })}
            </section>
          )}
        </main>
        <footer className="w-full flex sm:flex-row flex-col-reverse gap-4 items-center max-w-7xl p-4 sm:px-12 h-fit">
          <div className="flex flex-col w-full">
            <span className="text-sm xl:text-base">
              Powered by <strong>ChatGPT and Vercel Edge Functions</strong>.
            </span>
            <span className="text-sm xl:text-base">
              
              <Link
                className="text-blue-600 font-bold"
                target={"_blank"}
                href="https://github.com/"
              >
                {" "}
                
              </Link>
            </span>
          </div>
          <div className="flex flex-row w-fit gap-6">
            <Link href=" " target={"_blank"}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 sm:w-6 h-auto stroke-neutral-900 hover:stroke-neutral-600 transition ease-linear"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                />
              </svg>
            </Link>
          </div>
        </footer>
      </div>
    </>
  );
}
