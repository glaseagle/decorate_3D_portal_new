export interface SplatConfig {
  posX: number;
  posY: number;
  posZ: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  scale: number;
}

interface SplatPanelProps {
  config: SplatConfig;
  onChange: (config: Partial<SplatConfig>) => void;
}

function StepRow({ label, value, step, onChange, suffix }: {
  label: string;
  value: number;
  step: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  const fmt = step < 0.01 ? 3 : step < 0.1 ? 2 : step < 1 ? 1 : 0;
  return (
    <div className="flex items-center gap-1.5 mb-0.5">
      <label className="text-[10px] text-gray-500 w-6 shrink-0">{label}</label>
      <button
        onClick={() => onChange(+(value - step).toFixed(6))}
        className="px-1.5 py-0.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-[10px] leading-none"
      >
        -
      </button>
      <span className="text-[10px] text-gray-400 w-14 text-center shrink-0">
        {value.toFixed(fmt)}{suffix ?? ''}
      </span>
      <button
        onClick={() => onChange(+(value + step).toFixed(6))}
        className="px-1.5 py-0.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-[10px] leading-none"
      >
        +
      </button>
    </div>
  );
}

const SplatPanel: React.FC<SplatPanelProps> = ({ config, onChange }) => {
  const handleSave = () => {
    const json = JSON.stringify(config, null, 2);
    navigator.clipboard.writeText(json).then(() => {
      alert('Copied to clipboard:\n' + json);
    }).catch(() => {
      prompt('Copy these values:', json);
    });
  };

  return (
    <section className="mb-4">
      <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Gaussian Splat</h3>

      <div className="text-[10px] text-gray-500 mb-1">Position</div>
      <StepRow label="X" value={config.posX} step={0.01} onChange={(v) => onChange({ posX: v })} />
      <StepRow label="Y" value={config.posY} step={0.01} onChange={(v) => onChange({ posY: v })} />
      <StepRow label="Z" value={config.posZ} step={0.01} onChange={(v) => onChange({ posZ: v })} />

      <div className="text-[10px] text-gray-500 mt-2 mb-1">Rotation (deg)</div>
      <StepRow label="X" value={config.rotX} step={5} onChange={(v) => onChange({ rotX: v })} suffix="deg" />
      <StepRow label="Y" value={config.rotY} step={5} onChange={(v) => onChange({ rotY: v })} suffix="deg" />
      <StepRow label="Z" value={config.rotZ} step={5} onChange={(v) => onChange({ rotZ: v })} suffix="deg" />

      <div className="text-[10px] text-gray-500 mt-2 mb-1">Scale</div>
      <StepRow label="S" value={config.scale} step={0.005} onChange={(v) => onChange({ scale: Math.max(0.001, v) })} />

      <button
        onClick={handleSave}
        className="mt-3 w-full px-2 py-1.5 bg-blue-800 hover:bg-blue-700 text-white rounded text-xs transition-colors"
      >
        Save Values
      </button>
    </section>
  );
};

export default SplatPanel;
