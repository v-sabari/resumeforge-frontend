import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SectionRenderer } from './SectionRenderer';

const SortableSectionItem = ({ section, actions, ...rest }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <SectionRenderer
        section={section}
        actions={actions}
        dragHandleProps={{ ...attributes, ...listeners }}
        {...rest}
      />
    </div>
  );
};

export const SortableSectionList = ({ sections, onDragEnd, ...rest }) => {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={sections} strategy={verticalListSortingStrategy}>
        <div className="space-y-6">
          {sections.map((section) => (
            <SortableSectionItem key={section} section={section} {...rest} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
