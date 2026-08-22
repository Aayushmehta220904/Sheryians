type PropRow = {
  prop: string;
  type: string;
  default: string;
  description: string;
};

interface PropsTableProps {
  data: PropRow[];
}

const PropsTable = ({ data }: PropsTableProps) => {
  return (
    <div className="props-table-wrap">
      <table className="props-table">
        <thead>
          <tr>
            <th className="text-sm font-semibold">Prop</th>
            <th className="text-sm font-semibold">Type</th>
            <th className="text-sm font-semibold">Default</th>
            <th className="text-sm font-semibold">Description</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.prop}>
              <td className="prop-name text-sm font-mono">{row.prop}</td>
              <td className="text-sm font-mono">{row.type}</td>
              <td className="text-sm font-mono">{row.default}</td>
              <td className="text-sm">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PropsTable;
