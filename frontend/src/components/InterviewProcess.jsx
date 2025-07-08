import React from 'react';
import ReactFlow, { Controls, Background, EdgeText } from 'reactflow';
import 'reactflow/dist/style.css';

const nodeStyle = {
  width: 200,
  height: 80,
  padding: 10,
  textAlign: 'center',
  backgroundColor: '#147fdc',
  color: 'white',
  borderRadius: 8,
  fontSize: 15,
};

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Orientation for students on companies coming for the placement' }, style: nodeStyle },
  { id: '2', position: { x: 300, y: 0 }, data: { label: 'Collect student database & share with the industries' }, style: nodeStyle },
  { id: '3', position: { x: 600, y: 0 }, data: { label: 'Visit industry and invite them for campus interview' }, style: nodeStyle },
  { id: '4', position: { x: 900, y: 0 }, data: { label: 'Receive acceptance and finalize selection criteria and date' }, style: nodeStyle },
  { id: '5', position: { x: 900, y: 100 }, data: { label: 'Select students based on the criteria defined and inform students' }, style: nodeStyle },
  { id: '6', position: { x: 600, y: 100 }, data: { label: 'Arrange training to students - seniors, faculty & external' }, style: nodeStyle },
  { id: '7', position: { x: 600, y: 200 }, data: { label: 'Coordinate arrangements test, interview and selection' }, style: nodeStyle },
  { id: '8', position: { x: 600, y: 300 }, data: { label: 'Collect test and interview performance feedback from the industry' }, style: nodeStyle },
  { id: '9', position: { x: 600, y: 400 }, data: { label: 'Receive appointment order of the selected students' }, style: nodeStyle },
  { id: '10', position: { x: 0, y: 100 }, data: { label: 'During third year collect database and resumes of all students' }, style: nodeStyle },
  { id: '11', position: { x: 300, y: 100 }, data: { label: 'Assessment of students on Aptitude Skills by external agency' }, style: nodeStyle },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e4-5', source: '4', target: '5' },
  { id: 'e5-7', source: '5', target: '7' },
  { id: 'e6-7', source: '6', target: '7' },
  { id: 'e7-8', source: '7', target: '8' },
  { id: 'e8-9', source: '8', target: '9' },
  { id: 'e10-11', source: '10', target: '11' },
  { id: 'e11-6', source: '11', target: '6' },
];

function InterviewProcess() {
  return (
    <div className="w-full h-[80vh] flex items-center justify-center md:h-[60vh]">
      <div className="w-[90vw] items-center justify-center h-full overflow-x-auto">
        <div style={{ width: '1400px', height: '380px' }}>
          <ReactFlow
            nodes={initialNodes}
            edges={initialEdges}
            nodesDraggable={false}
            panOnDrag={false}
            elementsSelectable={true}
            zoomOnScroll={false}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export default InterviewProcess;
