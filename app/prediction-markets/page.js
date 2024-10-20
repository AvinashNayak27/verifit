"use client";
import dynamic from 'next/dynamic'
const DynamicHeader = dynamic(() => import('../../components/prediction-markets').then(mod => mod.PredictionMarkets), {
  ssr: false,
})

export default function PredictionMarketsPage() {
  return <DynamicHeader />;
}
