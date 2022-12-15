import { useRouter } from 'next/router';

export default function Recipe() {
  const router = useRouter();
  const { id } = router.query;
  return <p>Recipe: {id}</p>;
}
