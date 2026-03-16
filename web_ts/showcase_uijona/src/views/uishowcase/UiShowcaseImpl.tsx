// UiShowcaseImpl.tsx — JONA Impl (state + logic)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UiShowcaseView } from './UiShowcaseView';
import { COMPONENT_REGISTRY } from '../../data/componentRegistry';

export const UiShowcaseImpl: React.FC = () => {
  const { componentId } = useParams<{ componentId: string }>();
  const navigate = useNavigate();

  const activeId = componentId ?? COMPONENT_REGISTRY[0].id;
  const entry = COMPONENT_REGISTRY.find((c) => c.id === activeId);

  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'docs'>('preview');
  const [code, setCode] = useState(entry?.defaultCode ?? '');

  useEffect(() => {
    const e = COMPONENT_REGISTRY.find((c) => c.id === activeId);
    if (e) setCode(e.defaultCode);
    setActiveTab('preview');
  }, [activeId]);

  function handleSelectComponent(id: string) {
    navigate(`/showcase/${id}`);
  }

  return (
    <UiShowcaseView
      activeId={activeId}
      activeTab={activeTab}
      code={code}
      onSelectComponent={handleSelectComponent}
      onTabChange={setActiveTab}
      onCodeChange={setCode}
    />
  );
};
