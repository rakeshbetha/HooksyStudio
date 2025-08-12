import { Eye, Edit, Trash2, Pin, PinOff } from "lucide-react";

export type HookItem = {
  id: string;
  title: string;
  platform?: string;
  createdAt: string | Date;
  pinned?: boolean;
};

type Props = {
  item: HookItem;
  onShow: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string, next: boolean) => void;
};

export default function HookCard({ item, onShow, onEdit, onDelete, onTogglePin }: Props) {
  const date = typeof item.createdAt === "string" ? new Date(item.createdAt) : item.createdAt;
  const meta = `${date.toLocaleDateString()} • ${item.platform ?? "Unknown"}`;

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      background: 'rgba(255, 255, 255, 0.05)',
      padding: '16px',
      backdropFilter: 'blur(8px)'
    }}>
      {/* Actions */}
      <div style={{
        position: 'absolute',
        right: '8px',
        top: '8px',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        opacity: 1,
        transition: 'opacity 0.2s ease'
      }}>
        <button 
          aria-label="Show" 
          style={{
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
          onClick={() => onShow(item.id)}
        >
          <Eye size={16} />
        </button>
        <button 
          aria-label="Edit" 
          style={{
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
          onClick={() => onEdit(item.id)}
        >
          <Edit size={16} />
        </button>
        <button
          aria-label={item.pinned ? "Unpin" : "Pin"}
          style={{
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
          onClick={() => onTogglePin(item.id, !item.pinned)}
        >
          {item.pinned ? <PinOff size={16} /> : <Pin size={16} />}
        </button>
        <button 
          aria-label="Delete" 
          style={{
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
          onClick={() => onDelete(item.id)}
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Content */}
      <div style={{ 
        minHeight: '72px', 
        paddingRight: '80px' // reserve space so actions never overlap
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 600,
          lineHeight: '1.4',
          margin: 0,
          color: 'white',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          wordBreak: 'break-word'
        }}>{item.title}</h3>
        <p style={{
          marginTop: '8px',
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.6)',
          margin: '8px 0 0 0'
        }}>{meta}</p>
      </div>
    </div>
  );
} 