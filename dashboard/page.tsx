import { useRouter } from 'next/navigation';

export function SomeComponentThatLinksToChat() {
    const router = useRouter();
    const selectedModel = '2552bae6-8024-4064-a8f2-ba9daeac77a4';

    const handleNavigateToChat = () => {
        router.push(`/chat?model=${selectedModel}`);
    };

    return <button onClick={handleNavigateToChat}>Start Chat</button>;
}