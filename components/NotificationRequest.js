import { memo, useEffect, useCallback, useState, useMemo, useRef } from 'react';
import { styled } from 'styled-components';

const Block = styled.div`
  color: red;
  font-size: 20px;
  width: 90%;
  padding: 20px;
  border: 1px solid black;
`;

const Input = styled.input`
  width: 150px;
  display: block;
  margin: 10px 0 0;
  height: 20px;
  border-radius: 10px;
  outline: none;
  padding: 10px;
  border: 1px solid black;
  font-size: 16px;
`;

const Btn = styled.button`
  display: block;
  margin: 10px 0 0;
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

const NotificationRequest = () => {
  const inputRef = useRef();
  const [notificationModalType, setNotificationModalType] = useState(null);

  const sendNotification = useCallback(async () => {
    await fetch(`/api/notification?title=${inputRef.current?.value}`, {
      method: 'GET',
    });
  }, []);

  const subscribe = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

    setNotificationModalType(null);

    const registration = await navigator.serviceWorker.ready;

    const subscription = await registration?.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
    });

    await fetch('/api/notification', {
      method: 'POST',
      body: JSON.stringify(subscription),
    });
  }, []);

  useEffect(() => {
    if (!window.Notification || !('PushManager' in window)) return;

    const permissionState = window.Notification.permission;

    if (permissionState === 'granted') {
      subscribe();
    } else {
      // TODO: use local storage to decide whether the modal should show again
      // denied || default
      setNotificationModalType(permissionState);
    }

    alert('hihi, test');
  }, [subscribe]);

  const MainContent = useMemo(
    () => (
      <>
        {notificationModalType ? (
          <Block>
            <h1>{notificationModalType}</h1>
            {notificationModalType === 'denied' ? (
              <>
                老哥, 求你了, 把瀏覽器的通知打開
                <Btn
                  onClick={() => {
                    // TODO: local storage record, safari 沒辦法監聽 permission 改動, 不確定該怎辦 (不管 下次進來?)
                    setNotificationModalType(null);
                  }}
                >
                  悲慘拒絕
                </Btn>
              </>
            ) : (
              // default
              <>
                趕緊的接受通知！
                <Btn onClick={subscribe}>開心接受</Btn>
                <Btn
                  onClick={() => {
                    // TODO: local storage record
                    setNotificationModalType(null);
                  }}
                >
                  痛哭流涕
                </Btn>
              </>
            )}
          </Block>
        ) : null}
        <Input ref={inputRef} />
        {/* <Btn onClick={subscribe}>manual subscribe</Btn> */}
        <Btn onClick={sendNotification}>sendNotification</Btn>
      </>
    ),
    [notificationModalType, subscribe, sendNotification],
  );

  return MainContent;
};

export default memo(NotificationRequest);
