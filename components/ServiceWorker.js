import { memo, useEffect, useState, useCallback } from 'react';

import styled, { css } from 'styled-components';

const Prompt = styled.div`
  width: 250px;
  padding: 20px;
  background-color: white;
  box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.2);
  color: black;
  position: absolute;
  opacity: 0;
  top: 0px;
  left: 50%;
  transform: translate(-50%, 0);
  border-radius: 10px;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;

  ${(props) =>
    props.$show &&
    css`
      top: 20px;
      opacity: 1;
      pointer-events: auto;
    `}
`;

const BtnWrapper = styled.div`
  display: flex;
`;

const Btn = styled.button`
  margin: 0 5px;
  border-radius: 10px;
  background-color: white;
  outline: none;
  cursor: pointer;
  border: none;
  padding: 10px;
  min-width: 90px;
  height: 45px;
  box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.2);

  @media (hover: hover) {
    &:hover {
      opacity: 0.8;
    }
  }
`;

const ServiceWorker = () => {
  const [isShowPrompt, setIsShowPrompt] = useState(false);

  const handleAgreeReload = useCallback(() => {
    setIsShowPrompt(false);

    if ('serviceWorker' in navigator && window.workbox) {
      const wb = window.workbox;
      wb.messageSkipWaiting();
    }
  }, []);

  const handleRejectReload = useCallback(() => {
    setIsShowPrompt(false);
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator && window.workbox) {
      const wb = window.workbox;
      wb.addEventListener('waiting', () => {
        setIsShowPrompt(true);
        wb.addEventListener('controlling', () => {
          window.location.reload();
        });
      });
    }
  }, []);

  return (
    <>
      <Prompt $show={isShowPrompt}>
        <p>有新版本, 重整更新?</p>
        <BtnWrapper>
          <Btn onClick={handleAgreeReload}>Agree</Btn>
          <Btn onClick={handleRejectReload}>Reject</Btn>
        </BtnWrapper>
      </Prompt>
    </>
  );
};

export default memo(ServiceWorker);
