// @vitest-environment jsdom
import React from "react";
import {afterEach,expect,it,vi} from "vitest";
import {act,cleanup,fireEvent,render,screen,waitFor} from "@testing-library/react";
import {AISelection} from "../src/AISelection";
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
const capture={token:"captured",text:"A complicated sentence.",canApply:true,tabId:7,url:"https://example.com"};
it("requires consent after capture, previews a suggestion and replaces only after explicit Apply",async()=>{
  const apply=vi.fn(async()=>{}),discard=vi.fn();
  const fetcher=vi.fn<typeof fetch>(async url=>new Response(JSON.stringify(String(url).endsWith("/health")?{ready:true}:{simplified:"A simple sentence."})));
  vi.stubGlobal("fetch",fetcher);vi.stubGlobal("chrome",{permissions:{request:vi.fn(async()=>true)}});
  render(<AISelection pageEpoch={0} captureSelection={async()=>capture} applySimplification={apply} discardSelection={discard}/>);
  fireEvent.click(screen.getByRole("button",{name:"Capture selection"}));await screen.findByText(capture.text);
  expect(fetcher).not.toHaveBeenCalled();
  expect((screen.getByRole("button",{name:"Simplify selection"}) as HTMLButtonElement).disabled).toBe(true);
  fireEvent.click(screen.getByRole("button",{name:"Connect local AI service"}));await screen.findByText(/Connected to the local model/);
  fireEvent.click(screen.getByRole("checkbox"));fireEvent.click(screen.getByRole("button",{name:"Simplify selection"}));await screen.findByText("A simple sentence.");expect(apply).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button",{name:"Apply suggestion to page"}));await waitFor(()=>expect(apply).toHaveBeenCalledWith(capture,"A simple sentence."));
});
it("aborts generation and drops captured text/consent on a page epoch change",async()=>{
  let pending!: (value:Response)=>void;let signal:AbortSignal|undefined;
  vi.stubGlobal("chrome",{permissions:{request:vi.fn(async()=>true)}});
  vi.stubGlobal("fetch",vi.fn<typeof fetch>(async(url,init)=>{if(String(url).endsWith("/health"))return new Response('{"ready":true}');signal=init?.signal as AbortSignal;return await new Promise<Response>(resolve=>{pending=resolve;});}));
  const props={captureSelection:async()=>capture,applySimplification:vi.fn(async()=>{}),discardSelection:vi.fn()};
  const view=render(<AISelection pageEpoch={0} {...props}/>);
  fireEvent.click(screen.getByRole("button",{name:"Connect local AI service"}));await screen.findByText(/Connected to the local model/);
  fireEvent.click(screen.getByRole("button",{name:"Capture selection"}));await screen.findByText(capture.text);fireEvent.click(screen.getByRole("checkbox"));fireEvent.click(screen.getByRole("button",{name:"Simplify selection"}));await waitFor(()=>expect(signal).toBeDefined());
  view.rerender(<AISelection pageEpoch={1} {...props}/>);expect(signal?.aborted).toBe(true);expect(screen.queryByText(capture.text)).toBeNull();
  await act(async()=>pending(new Response('{"simplified":"Stale result"}')));expect(screen.queryByText("Stale result")).toBeNull();
});
