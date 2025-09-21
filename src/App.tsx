import './App.css'

import {Mosaic, MosaicWindow, DefaultToolbarButton} from 'react-mosaic-component'
import 'react-mosaic-component/react-mosaic-component.css'
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';

import {type JSX} from 'react'
import AboutView from "@/components/AboutView.tsx";
import HelpView from "@/components/HelpView.tsx";
import type {PyMenuAction} from "@/models";
import {useMosaicStore} from "@/store/mosaicStore.ts";

const ELEMENT_MAP: Record<PyMenuAction, JSX.Element> = {
  "about": <AboutView />,
  "help": <HelpView />
}

function App() {
  const {mosaicValue, setMosaicValue, removeView, maximizeView, minimizeView} = useMosaicStore();
  // const clickMinSize = (id: PyMenuAction) => {
  //   console.log("clickMinSize", id);
  // }
  return (
    <div id="app">
      <Mosaic<PyMenuAction>
        value={mosaicValue}
        onChange={setMosaicValue}
        renderTile={(id, path) => (
          <MosaicWindow<PyMenuAction>
            path={path}
            title={id}
            toolbarControls={[
              <DefaultToolbarButton
                title="Minimize"
                onClick={() => minimizeView(id)}
                className="bp6-icon-minus"
              />,
              <DefaultToolbarButton
                title="Maximize"
                onClick={() => maximizeView(id)}
                className="bp6-icon-maximize"
              />,
              <DefaultToolbarButton
                title="Close Window"
                onClick={() => removeView(id)}
                className="mosaic-default-control bp6-button bp6-minimal close-button bp6-icon-cross"
              />
            //   <button title="Expand"
            //           className="mosaic-default-control bp6-button bp6-minimal expand-button bp6-icon-maximize"></button>,
            //   <button title="Close Window"
            //           className="mosaic-default-control bp6-button bp6-minimal close-button bp6-icon-cross"></button>
            //
            ]}
          >
            {ELEMENT_MAP[id]}
          </MosaicWindow>
        )}
        className="mosaic-blueprint-theme"
        blueprintNamespace="bp6"
      >
      </Mosaic>
    </div>
  )
}

export default App
