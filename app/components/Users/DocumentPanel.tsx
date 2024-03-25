import { Collapse, Input } from 'antd'; // or wherever you import these from
import { camelToTitleCase,  getConfidenceColor } from '@/app/lib/utils/utils';

type DocumentDataFieldsProps = {
  sampleCoordinatesObject: any; // replace 'any' with the actual type
  toggleHighlightVisibility: (key: string) => void;
};
const { Panel } = Collapse;

const DocumentPanel: React.FC<DocumentDataFieldsProps> = ({ sampleCoordinatesObject, toggleHighlightVisibility }) => (
  <Collapse bordered={false} defaultActiveKey={['1']} style={{ marginBottom: '20px', background: 'white' }}>
    <Panel header={<span className="font-bold">Document Data Fields</span>} key="1">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {Object.entries(sampleCoordinatesObject as Record<string, { valueString: string, confidence: number }>).map(([key, { valueString, confidence }]) => (
            <div key={key}>
                <label style={{ display: 'block', marginBottom: '5px' }}>{camelToTitleCase(key)}</label>
                <Input.TextArea
                    onClick={() => toggleHighlightVisibility(key)}
                    defaultValue={valueString}
                    autoSize={{ minRows: 1, maxRows: 6 }}
                    style={{
                        backgroundColor: getConfidenceColor(confidence).backgroundColor,
                        borderColor: getConfidenceColor(confidence).borderColor,
                    }}
                />
            </div>
        ))}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}> Notes</label>
          <Input.TextArea placeholder="Notes..." />
        </div>
      </div>
    </Panel>
  </Collapse>
);

export default DocumentPanel;