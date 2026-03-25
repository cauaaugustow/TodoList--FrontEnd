import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTarefas, createTask, deleteTask, updateTask } from './services/taskServices';
import { getLabels } from './services/labelServices';
import type { Task } from './types/task/task';
import type { Label } from './types/label';
import type { TaskCreateRequest } from './types/task/taskcreaterequest';
import './index.css';
import './home.css';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    labelIds: [] as number[],
  });

  // Carregar dados ao montar o componente
  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (!userData) {
          navigate('/login');
          return;
        }

        const user = JSON.parse(userData);
        const tasksData = await getTarefas(user.id);
        const labelsData = await getLabels();

        setTasks(tasksData);
        setLabels(labelsData);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar tarefas');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLabelToggle = (labelId: number) => {
    setFormData((prev) => ({
      ...prev,
      labelIds: prev.labelIds.includes(labelId)
        ? prev.labelIds.filter((id) => id !== labelId)
        : [...prev.labelIds, labelId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      if (!formData.title.trim()) {
        setError('Título da tarefa é obrigatório');
        return;
      }

      const userData = localStorage.getItem('user');
      if (!userData) {
        navigate('/login');
        return;
      }

      const user = JSON.parse(userData);

      const taskData: Omit<TaskCreateRequest, 'id'> = {
        title: formData.title,
        description: formData.description,
        done: false,
        labelIds: formData.labelIds,
      };

      if (editingTask) {
        
        const updatedTask = await updateTask(taskData, editingTask.id);
        setTasks((prev) =>
          prev.map((task) => (task.id === editingTask.id ? updatedTask : task))
        );
        setEditingTask(null);
      } else {
        
        const newTask = await createTask(taskData, user.id);
        setTasks((prev) => [...prev, newTask]);
      }

      
      setFormData({ title: '', description: '', labelIds: [] });
      setShowModal(false);
    } catch (err) {
      console.error('Erro ao salvar tarefa:', err);
      setError('Erro ao salvar tarefa');
    }
  };

  const handleDelete = async (taskId: number) => {
    if (!confirm('Tem certeza que deseja deletar esta tarefa?')) {
      return;
    }

    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error('Erro ao deletar tarefa:', err);
      setError('Erro ao deletar tarefa');
    }
  };

  const handleToggleDone = async (task: Task) => {
    try {
      const updatedTask = await updateTask(
        {
          title: task.title,
          description: task.description?.text || '',
          done: !task.done,
          labelIds: task.labels.map((label) => label.id),
        },
        task.id
      );
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? updatedTask : t))
      );
    } catch (err) {
      console.error('Erro ao atualizar tarefa:', err);
      setError('Erro ao atualizar tarefa');
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description?.text || '',
      labelIds: task.labels.map((label) => label.id),
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setFormData({ title: '', description: '', labelIds: [] });
    setError('');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-content">
          <h1> Minhas Tarefas</h1>
          <button onClick={handleLogout} className="logout-button">
            Sair
          </button>
        </div>
      </header>

      <main className="home-main">
        <div className="tasks-section">
          <div className="section-header">
            <h2>Suas Tarefas ({tasks.length})</h2>
            <button
              onClick={() => setShowModal(true)}
              className="add-task-button"
            >
              + Adicionar Tarefa
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="tasks-list">
            {tasks.length === 0 ? (
              <div className="empty-state">
                <p>Nenhuma tarefa criada ainda</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="add-task-button-secondary"
                >
                  Criar primeira tarefa
                </button>
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`task-item ${task.done ? 'completed' : ''}`}
                >
                  <div className="task-content">
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => handleToggleDone(task)}
                      className="task-checkbox"
                    />
                    <div className="task-info">
                      <h3>{task.title}</h3>
                      {task.description && (
                        <p className="task-description">
                          {task.description.text}
                        </p>
                      )}
                      {task.labels.length > 0 && (
                        <div className="task-labels">
                          {task.labels.map((label) => (
                            <span key={label.id} className="label-tag">
                              {label.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="task-actions">
                    <button
                      onClick={() => handleEdit(task)}
                      className="btn-edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="btn-delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Modal para criar/editar tarefa */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {editingTask ? 'Editar Tarefa' : 'Criar Nova Tarefa'}
              </h2>
              <button onClick={handleCloseModal} className="close-button">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="title">Título *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Digite o título da tarefa"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Descrição</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Digite a descrição da tarefa"
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>Etiquetas</label>
                <div className="labels-grid">
                  {labels.map((label) => (
                    <label key={label.id} className="label-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.labelIds.includes(label.id)}
                        onChange={() => handleLabelToggle(label.id)}
                      />
                      <span>{label.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn-cancel"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-submit">
                  {editingTask ? 'Atualizar' : 'Criar'} Tarefa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
