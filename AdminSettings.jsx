import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Settings, 
  Save, 
  Mail, 
  Palette, 
  Store,
  TestTube
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminSettings = () => {
  const [config, setConfig] = useState({
    nome_loja: '',
    cor_primaria: '#007bff',
    cor_secundaria: '#6c757d',
    logo_path: '',
    email_smtp_host: '',
    email_smtp_port: 587,
    email_usuario: '',
    email_senha: '',
    email_remetente: ''
  });
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [testEmail, setTestEmail] = useState('');

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/configuracao`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (response.ok) {
        setConfig(data);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaveLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/configuracao`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(config),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Configurações salvas com sucesso!'
        });
      } else {
        setMessage({
          type: 'error',
          text: data.erro || 'Erro ao salvar configurações'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Erro de conexão'
      });
    } finally {
      setSaveLoading(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleTestEmail = async () => {
    if (!testEmail) {
      setMessage({
        type: 'error',
        text: 'Por favor, insira um email para teste'
      });
      setTimeout(() => setMessage(null), 5000);
      return;
    }

    setTestEmailLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/testar-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email_teste: testEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Email de teste enviado com sucesso!'
        });
      } else {
        setMessage({
          type: 'error',
          text: data.erro || 'Erro ao enviar email de teste'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Erro de conexão'
      });
    } finally {
      setTestEmailLoading(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/admin/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft size={16} className="mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Configurações da Loja
            </h1>
            <p className="text-gray-600">
              Personalize sua loja e configure funcionalidades
            </p>
          </div>
        </div>
        
        <Button onClick={handleSave} disabled={saveLoading}>
          {saveLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Salvando...
            </>
          ) : (
            <>
              <Save size={16} className="mr-2" />
              Salvar Configurações
            </>
          )}
        </Button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <Tabs defaultValue="geral" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="aparencia">Aparência</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>

        {/* Configurações Gerais */}
        <TabsContent value="geral">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Store size={20} />
                <span>Configurações Gerais</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome_loja">Nome da Loja</Label>
                <Input
                  id="nome_loja"
                  value={config.nome_loja}
                  onChange={(e) => handleChange('nome_loja', e.target.value)}
                  placeholder="Nome da sua loja"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo_path">URL do Logo</Label>
                <Input
                  id="logo_path"
                  value={config.logo_path}
                  onChange={(e) => handleChange('logo_path', e.target.value)}
                  placeholder="https://exemplo.com/logo.png"
                />
                <p className="text-xs text-gray-500">
                  URL da imagem do logo da loja (opcional)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Aparência */}
        <TabsContent value="aparencia">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette size={20} />
                <span>Aparência da Loja</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cor_primaria">Cor Primária</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="cor_primaria"
                      type="color"
                      value={config.cor_primaria}
                      onChange={(e) => handleChange('cor_primaria', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={config.cor_primaria}
                      onChange={(e) => handleChange('cor_primaria', e.target.value)}
                      placeholder="#007bff"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cor_secundaria">Cor Secundária</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="cor_secundaria"
                      type="color"
                      value={config.cor_secundaria}
                      onChange={(e) => handleChange('cor_secundaria', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={config.cor_secundaria}
                      onChange={(e) => handleChange('cor_secundaria', e.target.value)}
                      placeholder="#6c757d"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Prévia das Cores</h4>
                <div className="flex space-x-4">
                  <div 
                    className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-xs font-medium"
                    style={{ backgroundColor: config.cor_primaria }}
                  >
                    Primária
                  </div>
                  <div 
                    className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-xs font-medium"
                    style={{ backgroundColor: config.cor_secundaria }}
                  >
                    Secundária
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Email */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail size={20} />
                <span>Configurações de Email</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email_smtp_host">Servidor SMTP</Label>
                  <Input
                    id="email_smtp_host"
                    value={config.email_smtp_host}
                    onChange={(e) => handleChange('email_smtp_host', e.target.value)}
                    placeholder="smtp.gmail.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email_smtp_port">Porta SMTP</Label>
                  <Input
                    id="email_smtp_port"
                    type="number"
                    value={config.email_smtp_port}
                    onChange={(e) => handleChange('email_smtp_port', parseInt(e.target.value))}
                    placeholder="587"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email_usuario">Usuário do Email</Label>
                <Input
                  id="email_usuario"
                  type="email"
                  value={config.email_usuario}
                  onChange={(e) => handleChange('email_usuario', e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email_senha">Senha do Email</Label>
                <Input
                  id="email_senha"
                  type="password"
                  value={config.email_senha}
                  onChange={(e) => handleChange('email_senha', e.target.value)}
                  placeholder="Senha ou token de aplicativo"
                />
                <p className="text-xs text-gray-500">
                  Para Gmail, use uma senha de aplicativo específica
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email_remetente">Email Remetente</Label>
                <Input
                  id="email_remetente"
                  type="email"
                  value={config.email_remetente}
                  onChange={(e) => handleChange('email_remetente', e.target.value)}
                  placeholder="noreply@suaempresa.com"
                />
                <p className="text-xs text-gray-500">
                  Email que aparecerá como remetente (opcional, usa o usuário se vazio)
                </p>
              </div>

              {/* Teste de Email */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3 flex items-center space-x-2">
                  <TestTube size={16} />
                  <span>Testar Configurações de Email</span>
                </h4>
                
                <div className="flex space-x-2">
                  <Input
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="email@teste.com"
                    type="email"
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleTestEmail} 
                    disabled={testEmailLoading}
                    variant="outline"
                  >
                    {testEmailLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      'Enviar Teste'
                    )}
                  </Button>
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  Envie um email de teste para verificar se as configurações estão corretas
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;

