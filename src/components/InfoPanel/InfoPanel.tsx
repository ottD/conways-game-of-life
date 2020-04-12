import * as React from 'react';
import { Panel, Link, PrimaryButton } from 'office-ui-fabric-react';
import { useConstCallback } from '@uifabric/react-hooks';

export interface IInfoPanelProps {
  onDismiss(): void;
}

export const InfoPanel = ({ onDismiss }: IInfoPanelProps) => {

  const onRenderFooterContent = useConstCallback(() => (
    <PrimaryButton onClick={onDismiss}>Close</PrimaryButton>
  ));

  return (
    <Panel
      headerText="Conway's Game of Life"
      isOpen={true}
      onDismiss={onDismiss}
      closeButtonAriaLabel="Close"
      onRenderFooterContent={onRenderFooterContent}>
      <p>
        <Link href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target="_blank">Conway`&apos;`s Game of Life</Link>
        {' '} is a cellular automaton invented devised by the British mathematician John Horton Conway in 1970.
      </p>
      <p>
        <strong>Rules:</strong>
        <ul>
          <li>Any live cell with two or three live neighbors survives.</li>
          <li>Any dead cell with three live neighbors becomes a live cell.</li>
          <li>All other live cells die in the next generation. Similarly, all other dead cells stay dead.</li>
        </ul>
      </p>
    </Panel>
  );
};