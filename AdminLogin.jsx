import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdmin } from '../../contexts/AdminContext';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    usuario: '',
    senha: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [createAdminData, setCreateAdminData] = useState({
    usuario: '',
    senha: '',
    confirmarSenha: ''
  });
  const [createLoading, setCreateLoading] = useState(false);

  const { admin, login, createFirstAdmin } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (admin) {
      navigate('/admin/dashboard');
    }
  }, [admin, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleCreateAdminChange = (e) => {
    setCreateAdminData({
      ...createAdminData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.usuario || !formData.senha) {
      setError('Por favor, preencha todos os campos');
      setLoading(false);
      return;
    }

    try {
      const result = await login(formData.usuario, formData.senha);
      
      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setError(result.message);
        // Se o erro indica que não há admin, mostrar opção de criar
        if (result.message.includes('não encontrado') || result.message.includes('incorretos')) {
          setShowCreateAdmin(true);
        }
      }
    } catch (error) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setError('');

    if (!createAdminData.usuario || !createAdminData.senha) {
      setError('Usuário e senha são obrigatórios');
      setCreateLoading(false);
      return;
    }

    if (createAdminData.senha.length < 8) {
      setError('Senha deve ter pelo menos 8 caracteres');
      setCreateLoading(false);
      return;
    }

    if (createAdminData.senha !== createAdminData.confirmarSenha) {
      setError('Senhas não coincidem');
      setCreateLoading(false);
      return;
    }

    try {
      const result = await createFirstAdmin(createAdminData.usuario, createAdminData.senha);
      
      if (result.success) {
        setShowCreateAdmin(false);
        setError('');
        // Tentar fazer login automaticamente
        const loginResult = await login(createAdminData.usuario, createAdminData.senha);
        if (loginResult.success) {
          navigate('/admin/dashboard');
        }
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            {showCreateAdmin ? <UserPlus className="text-white" size={24} /> : <Shield className="text-white" size={24} />}
          </div>
          <CardTitle className="text-2xl font-bold">
            {showCreateAdmin ? 'Criar Administrador' : 'Painel Administrativo'}
          </CardTitle>
          <p className="text-gray-600 text-sm">
            {showCreateAdmin 
              ? 'Crie o primeiro administrador do sistema'
              : 'Acesse o painel de administração'
            }
          </p>
        </CardHeader>

        <CardContent>
          {!showCreateAdmin ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="usuario">Usuário</Label>
                <Input
                  id="usuario"
                  name="usuario"
                  type="text"
                  placeholder="Nome de usuário"
                  value={formData.usuario}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <div className="relative">
                  <Input
                    id="senha"
                    name="senha"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Sua senha"
                    value={formData.senha}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Entrando...
                  </div>
                ) : (
                  'Entrar'
                )}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateAdmin(true)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Criar primeiro administrador
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="createUsuario">Usuário</Label>
                <Input
                  id="createUsuario"
                  name="usuario"
                  type="text"
                  placeholder="Nome de usuário"
                  value={createAdminData.usuario}
                  onChange={handleCreateAdminChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="createSenha">Senha</Label>
                <Input
                  id="createSenha"
                  name="senha"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={createAdminData.senha}
                  onChange={handleCreateAdminChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
                <Input
                  id="confirmarSenha"
                  name="confirmarSenha"
                  type="password"
                  placeholder="Digite a senha novamente"
                  value={createAdminData.confirmarSenha}
                  onChange={handleCreateAdminChange}
                  required
                />
              </div>

              <div className="flex space-x-2">
                <Button 
                  type="submit" 
                  className="flex-1" 
                  disabled={createLoading}
                >
                  {createLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Criando...
                    </div>
                  ) : (
                    'Criar Administrador'
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateAdmin(false);
                    setError('');
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;

