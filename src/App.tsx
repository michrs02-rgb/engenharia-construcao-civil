import React, { useState, useMemo, useEffect } from 'react';

// Tipagem para obras do portfólio
interface ProjectItem {
  id: string;
  code: string;
  title: string;
  category: 'pontes' | 'tuneis' | 'portos' | 'energia' | 'geotecnia';
  categoryLabel: string;
  location: string;
  budget: string;
  specs: {
    concrete: string;
    steel: string;
    excavation: string;
    bimLevel: string;
  };
  progress: number;
  status: 'Em Execução' | 'Concluído' | 'Fase de Comissionamento';
  description: string;
  telemetry: {
    strain: string;
    vibration: string;
    temperature: string;
    iotNodes: number;
  };
}

// Tipagem para maquinário pesado
interface MachineAsset {
  id: string;
  code: string;
  name: string;
  category: string;
  power: string;
  capacity: string;
  telemetryStatus: 'Operacional 100%' | 'Telemetria Ativa' | 'Manutenção Preventiva';
  icon: string;
  sensorData: {
    oilTemp: string;
    rpm: string;
    hours: string;
  };
}

export default function App() {
  // Estado para aba de navegação e filtros
  const [activeFilter, setActiveFilter] = useState<string>('todos');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [selectedProjectModal, setSelectedProjectModal] = useState<ProjectItem | null>(null);

  // Estado para Toast de Notificação
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'info' | 'warning' }>({
    visible: false,
    message: '',
    type: 'success',
  });

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 4500);
  };

  // Telemetria em tempo real simulada (pulso de dados cibernéticos)
  const [telemetryTick, setTelemetryTick] = useState<number>(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetryTick((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // --- SIMULADOR DE GRANDES OBRAS B2B ---
  const [simType, setSimType] = useState<'ponte' | 'tunel' | 'porto' | 'energia' | 'geotecnia'>('ponte');
  const [simExcavation, setSimExcavation] = useState<number>(120000); // m³
  const [simSteel, setSimSteel] = useState<number>(8500); // ton
  const [simConcrete, setSimConcrete] = useState<number>(45000); // m³
  const [simBimTier, setSimBimTier] = useState<'bim4d' | 'bim5d' | 'twin'>('twin');
  const [simMonths, setSimMonths] = useState<number>(24);

  // Cálculos reativos do simulador
  const simulationResults = useMemo(() => {
    // Custos base unitários médios de engenharia pesada de alta tecnologia
    const excavationCost = simExcavation * 75; // R$ 75 por m³ escavação pesada com detonação / contenção
    const steelCost = simSteel * 14500; // R$ 14.500 por tonelada montada de aço especial
    const concreteCost = simConcrete * 1250; // R$ 1.250 por m³ de CAD de alto desempenho
    
    // Multiplicador do nível BIM e Gêmeo Digital
    const bimMultiplier = simBimTier === 'twin' ? 1.08 : simBimTier === 'bim5d' ? 1.05 : 1.02;
    
    // Multiplicador de tipologia
    const typeFactors: Record<string, { label: string; factor: number; risk: string; machinery: string[] }> = {
      ponte: {
        label: 'Ponte Estaiada & Mega Viaduto Hiperestruturado',
        factor: 1.15,
        risk: 'Baixo / Monitorado por Piezômetros & Strain Gauges',
        machinery: [
          '2x Guindaste Treliçado 600T sobre Esteiras',
          '4x Caminhões Betoneira Térmicos com Telemetria',
          '1x Perfuratriz Hidráulica Rotativa 45m',
          'Sistema Lançador de Aduelas Sucessivas Automatizado',
        ],
      },
      tunel: {
        label: 'Túnel Rodoviário/Metroviário com Tuneladora TBM',
        factor: 1.45,
        risk: 'Médio-Controlado / Sondagem Geotécnica Sísmica Ativa',
        machinery: [
          '1x Mega-Tuneladora TBM Herrenknecht Ø 12.8m',
          '6x Trens Subterrâneos de Evacuação de Detritos',
          '2x Robôs de Concreto Projetado Shotcrete com LiDAR',
          'Central de Injeção de Argamassa Pressurizada',
        ],
      },
      porto: {
        label: 'Complexo Portuário de Águas Profundas & Terminal Off-shore',
        factor: 1.30,
        risk: 'Baixo / Bate-Estacas com Monitoramento Batimétrico',
        machinery: [
          '1x Balsa Bate-Estacas Marítima Hidráulica',
          '2x Draga de Sucção e Arrasto Autopropelida 15.000m³',
          '4x Pórticos Ship-to-Shore Super Post-Panamax',
          'Sistema Automatizado de Enrocamento com GPS RTK',
        ],
      },
      energia: {
        label: 'Usina Hidrelétrica / Vertedouro & Barragem Estratégica',
        factor: 1.40,
        risk: 'Crítico / Gêmeo Digital com 840 Sensores Piezométricos',
        machinery: [
          '4x Escavadeiras Pesadas CAT 395 de 90T',
          '8x Caminhões Fora-de-Estrada Rígidos 100T',
          '2x Centrais de Resfriamento Criogênico para CCR',
          'Sistema de Formas Deslizantes Contínuas Hidráulicas',
        ],
      },
      geotecnia: {
        label: 'Geotecnia Profunda, Enfilagens & Contenção de Encostas',
        factor: 1.20,
        risk: 'Controlado / Monitoramento de Recalques por Fibra Óptica',
        machinery: [
          '3x Perfuratrizes de Tirantes e Microestacas de Alta Rotação',
          '2x Bombas de Concreto Alta Pressão Schwing 120 bar',
          '1x Guindaste Telescópico Todo-Terreno 250T',
          'Drones RTK LiDAR de Mapeamento Topográfico Milimétrico',
        ],
      },
    };

    const currentConfig = typeFactors[simType];
    const rawTotal = (excavationCost + steelCost + concreteCost) * currentConfig.factor * bimMultiplier;
    
    // Prazo estimado em meses e produtividade
    const estimatedMonths = Math.max(12, Math.round(simMonths));
    const monthlyBurn = rawTotal / estimatedMonths;

    // Emissões de carbono compensadas estimadas (em toneladas de CO2e) através de concreto verde e traços otimizados
    const co2Reduction = Math.round((simConcrete * 0.18) + (simSteel * 0.45));

    return {
      totalCost: rawTotal,
      monthlyBurn,
      config: currentConfig,
      co2Reduction,
      bimTierName: simBimTier === 'twin' ? 'Gêmeo Digital com IoT em Tempo Real' : simBimTier === 'bim5d' ? 'BIM 5D Integrado (Custo + Prazo)' : 'BIM 4D (Modelagem Paramétrica)',
    };
  }, [simType, simExcavation, simSteel, simConcrete, simBimTier, simMonths]);

  // Formatação em Moeda Brasileira (R$)
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Envio do Simulador para WhatsApp B2B
  const handleSimulatorWhatsApp = () => {
    const phone = '5511999998888';
    const msg = `*KRONOS HEAVY ENGINEERING - SOLICITAÇÃO DE ESTUDO DE VIABILIDADE B2B*
=========================================
*Tipologia:* ${simulationResults.config.label}
*Volume de Escavação:* ${simExcavation.toLocaleString('pt-BR')} m³
*Aço Estrutural:* ${simSteel.toLocaleString('pt-BR')} toneladas
*Concreto CAD:* ${simConcrete.toLocaleString('pt-BR')} m³
*Nível BIM/Twin:* ${simulationResults.bimTierName}
*Prazo Alvo:* ${simMonths} meses
-----------------------------------------
*Estimativa Preliminar:* ${formatCurrency(simulationResults.totalCost)}
*Aporte Médio Mensal:* ${formatCurrency(simulationResults.monthlyBurn)}
*Redução de CO2 Estimada:* ${simulationResults.co2Reduction.toLocaleString('pt-BR')} tCO2e
=========================================
Gostaria de agendar uma reunião técnica com o time de engenharia e modelagem BIM da KRONOS.`;

    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    showToast('Simulação transferida para o canal técnico WhatsApp!', 'success');
  };

  // --- FORMULÁRIO DE PROPOSTA COMERCIAL / RFP B2B ---
  const [formData, setFormData] = useState({
    nome: '',
    empresa: '',
    cargo: '',
    email: '',
    telefone: '',
    tipoObra: 'Ponte / Viaduto Estaiado',
    orcamento: 'R$ 50M a R$ 200M',
    prazoInicio: 'Imediato (até 60 dias)',
    mensagem: '',
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.empresa || !formData.email || !formData.telefone) {
      showToast('Por favor, preencha todos os campos obrigatórios corporativos.', 'warning');
      return;
    }

    const phone = '5511999998888';
    const leadText = `*KRONOS HEAVY ENGINEERING - NOVA SOLICITAÇÃO DE RFP / PROPOSTA B2B*
=========================================
*Responsável:* ${formData.nome}
*Cargo:* ${formData.cargo || 'Não especificado'}
*Empresa / Consórcio:* ${formData.empresa}
*E-mail:* ${formData.email}
*Telefone/WhatsApp:* ${formData.telefone}
-----------------------------------------
*Tipologia de Obra:* ${formData.tipoObra}
*Faixa Orçamentária:* ${formData.orcamento}
*Prazo Previsto de Mobilização:* ${formData.prazoInicio}
*Especificações Adicionais:* ${formData.mensagem || 'Nenhum detalhe adicional informado'}
=========================================
Solicitação enviada via Portal Institucional KRONOS Cyber-Infrastructure.`;

    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(leadText)}`;
    window.open(url, '_blank');
    showToast('Proposta gerada! Redirecionando para o canal de Engenharia KRONOS...', 'success');
  };

  // Portfólio de Obras Emblemáticas
  const projects: ProjectItem[] = [
    {
      id: 'proj-01',
      code: 'KR-BRG-09',
      title: 'Mega Ponte Estaiada Trans-Oceânica Delta',
      category: 'pontes',
      categoryLabel: 'Pontes & Viadutos',
      location: 'Canal de Santos - SP',
      budget: 'R$ 1.840.000.000',
      specs: {
        concrete: '185.000 m³ CAD 80MPa',
        steel: '42.000 Ton Aço Patinável',
        excavation: '310.000 m³ Submarina',
        bimLevel: 'BIM LOD 500 + Digital Twin',
      },
      progress: 88,
      status: 'Em Execução',
      description: 'Ponte estaiada com vão livre central de 780 metros, mastros de concreto de 210 metros de altura com amortecedores de massa sintonizada e sistema de pesagem em movimento WIM.',
      telemetry: {
        strain: '142 µε (Nominal)',
        vibration: '0.014 g (Estável)',
        temperature: '26.4 °C',
        iotNodes: 480,
      },
    },
    {
      id: 'proj-02',
      code: 'KR-TNL-04',
      title: 'Túnel Serra-Mar com Tuneladora TBM Ø 13.2m',
      category: 'tuneis',
      categoryLabel: 'Túneis & Geotecnia',
      location: 'Trecho Rodoviário Serra do Mar - RJ/SP',
      budget: 'R$ 2.450.000.000',
      specs: {
        concrete: '240.000 m³ Aduelas Pré-moldadas',
        steel: '38.000 Ton de Armaduras CA-50',
        excavation: '1.420.000 m³ Rocha Sã Classe I/II',
        bimLevel: 'BIM 5D + LiDAR Subterrâneo',
      },
      progress: 64,
      status: 'Em Execução',
      description: 'Galeria dupla subterrânea de 8,4 km escavada com Mega-Tuneladora de rocha dura, revestida com anéis de aduelas de concreto de alta resistência com fibras metálicas.',
      telemetry: {
        strain: '89 µε (Seguro)',
        vibration: '0.038 g (Frente TBM)',
        temperature: '31.2 °C',
        iotNodes: 920,
      },
    },
    {
      id: 'proj-03',
      code: 'KR-PRT-02',
      title: 'Terminal Portuário Off-Shore V-Titan',
      category: 'portos',
      categoryLabel: 'Portos & Hidráulica',
      location: 'Porto de Suape - PE',
      budget: 'R$ 1.290.000.000',
      specs: {
        concrete: '110.000 m³ Concreto Marítimo',
        steel: '29.500 Ton de Estacas Metálicas',
        excavation: '2.800.000 m³ Dragagem Batimétrica',
        bimLevel: 'BIM LOD 400 + Sensores Oceanográficos',
      },
      progress: 95,
      status: 'Fase de Comissionamento',
      description: 'Cais flutuante de atracação para navios graneleiros Valemax de 400.000 DWT com calado de 24 metros e dolfins de amarração instrumentados.',
      telemetry: {
        strain: '110 µε (Sob carga)',
        vibration: '0.008 g (Maré Alta)',
        temperature: '28.1 °C',
        iotNodes: 340,
      },
    },
    {
      id: 'proj-04',
      code: 'KR-PWR-11',
      title: 'Complexo Hidrelétrico & Vertedouro Neo-Itaipu',
      category: 'energia',
      categoryLabel: 'Energia & Barragens',
      location: 'Bacia do Paraná - PR/MS',
      budget: 'R$ 3.800.000.000',
      specs: {
        concrete: '950.000 m³ Concreto Compactado a Rolo (CCR)',
        steel: '64.000 Ton Estruturas de Ensecadeiras',
        excavation: '4.200.000 m³ Basalto Maciço',
        bimLevel: 'Gêmeo Digital com IA Preditiva',
      },
      progress: 72,
      status: 'Em Execução',
      description: 'Barragem de gravidade em concreto compactado a rolo com altura de 125m, casa de força abrigada para 6 turbinas Francis e sistema automatizado de alívio piezométrico.',
      telemetry: {
        strain: '210 µε (Compressão Controlada)',
        vibration: '0.005 g (Frequência Fundamental)',
        temperature: '22.8 °C',
        iotNodes: 1450,
      },
    },
    {
      id: 'proj-05',
      code: 'KR-GEO-08',
      title: 'Estabilização Geotécnica de Maciço Crítico R-10',
      category: 'geotecnia',
      categoryLabel: 'Túneis & Geotecnia',
      location: 'Corredor Logístico Ferroviário de Carajás - PA',
      budget: 'R$ 480.000.000',
      specs: {
        concrete: '35.000 m³ Concreto Projetado com Fibras',
        steel: '12.800 Ton de Tirantes Protendidos Dywidag',
        excavation: '680.000 m³ Desmonte Controlado',
        bimLevel: 'BIM 4D Geológico + Drones LiDAR',
      },
      progress: 100,
      status: 'Concluído',
      description: 'Contenção definitiva de encosta rochosa instável com 1.400 tirantes protendidos de até 45 metros de comprimento, cortinas atirantadas e dreno sub-horizontal profundo.',
      telemetry: {
        strain: '45 µε (Sem deformação residual)',
        vibration: '0.002 g (Zero anomalia)',
        temperature: '25.0 °C',
        iotNodes: 280,
      },
    },
    {
      id: 'proj-06',
      code: 'KR-BRG-14',
      title: 'Viaduto Ferroviário Hiper-Vão Ferro-Norte',
      category: 'pontes',
      categoryLabel: 'Pontes & Viadutos',
      location: 'Malha Rondonópolis - MT',
      budget: 'R$ 720.000.000',
      specs: {
        concrete: '78.000 m³ Concreto Protendido Fck 60',
        steel: '18.400 Ton Vigas Mistas Aço-Concreto',
        excavation: '140.000 m³ Tubulões a Ar Comprimido',
        bimLevel: 'BIM LOD 450 + Sensores de Fadiga Cíclica',
      },
      progress: 100,
      status: 'Concluído',
      description: 'Viaduto ferroviário contínuo para trens de carga pesada (32,5 toneladas por eixo) com pilares esbeltos de 68 metros de altura e isoladores elastoméricos com núcleo de chumbo.',
      telemetry: {
        strain: '78 µε (Sob trem-tipo 32.5T)',
        vibration: '0.021 g (Frequência Amortecida)',
        temperature: '29.3 °C',
        iotNodes: 310,
      },
    },
  ];

  // Filtragem dos projetos
  const filteredProjects = useMemo(() => {
    if (activeFilter === 'todos') return projects;
    return projects.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

  // Frota Pesada KRONOS
  const machineryFleet: MachineAsset[] = [
    {
      id: 'mach-01',
      code: 'EXC-9001',
      name: 'CAT 395 Hidráulica de Mineração & Escavação Pesada',
      category: 'Movimentação de Terra',
      power: '543 HP (405 kW)',
      capacity: 'Caçamba 6.5 m³ / 95 Toneladas',
      telemetryStatus: 'Operacional 100%',
      icon: 'fa-solid fa-truck-monster',
      sensorData: {
        oilTemp: '84 °C',
        rpm: '1.850 RPM',
        hours: '4.820 h',
      },
    },
    {
      id: 'mach-02',
      code: 'TBM-1200',
      name: 'Mega-Tuneladora Herrenknecht S-1002 Hard-Rock',
      category: 'Tunelamento Subterrâneo',
      power: '6.300 kW Hidráulico',
      capacity: 'Diâmetro Ø 13.2m / 3.400 Toneladas',
      telemetryStatus: 'Telemetria Ativa',
      icon: 'fa-solid fa-circle-notch',
      sensorData: {
        oilTemp: '68 °C',
        rpm: '2.4 RPM (Cabeça de Corte)',
        hours: '1.940 h',
      },
    },
    {
      id: 'mach-03',
      code: 'CRN-0600',
      name: 'Guindaste Treliçado Liebherr LR 1600/2 Esteiras',
      category: 'Içamento Pesado & Aduelas',
      power: '544 HP Liebherr V8 Turbo',
      capacity: '600 Toneladas / Lança até 187m',
      telemetryStatus: 'Operacional 100%',
      icon: 'fa-solid fa-anchor',
      sensorData: {
        oilTemp: '76 °C',
        rpm: '1.600 RPM',
        hours: '6.150 h',
      },
    },
    {
      id: 'mach-04',
      code: 'DRL-0045',
      name: 'Perfuratriz Hidráulica Rotativa Bauer BG 45',
      category: 'Fundações Profundas & Estacas Raiz',
      power: '570 kW Cummins X15',
      capacity: 'Profundidade 115m / Torque 461 kNm',
      telemetryStatus: 'Operacional 100%',
      icon: 'fa-solid fa-compass-drafting',
      sensorData: {
        oilTemp: '81 °C',
        rpm: '32 RPM (Trado de Perfuração)',
        hours: '3.380 h',
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 relative font-sans selection:bg-blue-600 selection:text-white">
      {/* Toast flutuante de alta visibilidade */}
      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900/95 border border-blue-500/50 text-white px-5 py-4 rounded-xl shadow-2xl backdrop-blur-xl flex items-center gap-3 animate-bounce">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/40">
            {toast.type === 'success' && <i className="fa-solid fa-check"></i>}
            {toast.type === 'warning' && <i className="fa-solid fa-triangle-exclamation text-amber-400"></i>}
            {toast.type === 'info' && <i className="fa-solid fa-info text-blue-400"></i>}
          </div>
          <div className="text-sm font-medium">{toast.message}</div>
          <button
            onClick={() => setToast((prev) => ({ ...prev, visible: false }))}
            className="ml-auto text-slate-400 hover:text-white text-xs"
            aria-label="Fechar notificação"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

      {/* Cyber Grid Background */}
      <div className="fixed inset-0 cyber-grid pointer-events-none opacity-40 z-0"></div>
      <div className="fixed inset-0 bg-radial from-transparent via-[#050811]/70 to-[#050811] pointer-events-none z-0"></div>

      {/* TOPBAR TELEMETRIA LIVE HUD */}
      <div className="relative z-40 bg-[#03060c] border-b border-slate-800 text-[11px] font-mono tracking-wider text-slate-400 py-1.5 px-4 sm:px-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-blue-400">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            KRONOS GRID // CORE_SYS_ONLINE
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:flex items-center gap-1 text-slate-400">
            <i className="fa-solid fa-satellite text-blue-400/80"></i>
            SAT_SYNC: GNSS RTK ±2mm
          </span>
          <span className="hidden lg:flex items-center gap-1 text-emerald-400">
            <i className="fa-solid fa-shield-halved"></i>
            ZERO INCIDENTES: 1.450 DIAS
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-amber-400 font-semibold flex items-center gap-1">
            <i className="fa-solid fa-tower-broadcast"></i>
            BIM 5D TELEMETRIA ATIVA
          </span>
          <span className="text-slate-500 hidden sm:inline">CYCLE: #{10420 + telemetryTick}</span>
          <a
            href="https://api.whatsapp.com/send?phone=5511999998888&text=Ol%C3%A1%20Engenharia%20KRONOS%2C%20solicito%20atendimento%20de%20urg%C3%AAncia%20t%C3%A9cnica."
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 transition-colors"
          >
            <i className="fa-brands fa-whatsapp text-sm"></i>
            CANAL DIRETO VIP
          </a>
        </div>
      </div>

      {/* HEADER / NAVBAR PRINCIPAL */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#050811]/90 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo KRONOS */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-amber-500 p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
              <div className="w-full h-full bg-[#050811] rounded-[7px] flex items-center justify-center">
                <i className="fa-solid fa-cubes-stacked text-blue-400 text-lg group-hover:scale-110 transition-transform"></i>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-widest text-white uppercase font-sans">
                  KRONOS
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  INFRA 5.0
                </span>
              </div>
              <p className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                Engenharia Pesada & Gêmeos Digitais
              </p>
            </div>
          </a>

          {/* Menu Desktop */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <a href="#obras" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-1.5">
              <i className="fa-solid fa-layer-group text-xs text-blue-500"></i>
              Mega Obras
            </a>
            <a href="#simulador" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-1.5">
              <i className="fa-solid fa-calculator text-xs text-amber-500"></i>
              Simulador B2B
            </a>
            <a href="#telemetria" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-1.5">
              <i className="fa-solid fa-microchip text-xs text-indigo-400"></i>
              Telemetria & BIM 5D
            </a>
            <a href="#frota" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-1.5">
              <i className="fa-solid fa-truck-ramp-box text-xs text-blue-400"></i>
              Parque de Máquinas
            </a>
            <a href="#certificacoes" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-1.5">
              <i className="fa-solid fa-certificate text-xs text-emerald-400"></i>
              Compliance
            </a>
          </nav>

          {/* CTA Principal */}
          <div className="hidden sm:flex items-center gap-4">
            <a
              href="#simulador"
              className="px-4 py-2 text-xs font-mono font-semibold text-slate-300 bg-slate-900 border border-slate-700 hover:border-blue-500/50 rounded-lg transition-all"
            >
              <i className="fa-solid fa-sliders mr-1.5 text-blue-400"></i>
              ESTIMAR ORÇAMENTO
            </a>
            <a
              href="#contato"
              className="relative group px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 flex items-center gap-2"
            >
              <span>Solicitar RFP / B2B</span>
              <i className="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
            </a>
          </div>

          {/* Botão Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Abrir menu"
          >
            <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-lg`}></i>
          </button>
        </div>

        {/* Menu Mobile Retrátil */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#050811]/98 border-b border-slate-800 px-6 py-6 space-y-4">
            <a
              href="#obras"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-200 hover:text-blue-400 py-2 border-b border-slate-800/60"
            >
              <i className="fa-solid fa-layer-group mr-2 text-blue-500"></i>
              Mega Obras & Portfólio
            </a>
            <a
              href="#simulador"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-200 hover:text-amber-400 py-2 border-b border-slate-800/60"
            >
              <i className="fa-solid fa-calculator mr-2 text-amber-500"></i>
              Simulador de Investimento B2B
            </a>
            <a
              href="#telemetria"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-200 hover:text-indigo-400 py-2 border-b border-slate-800/60"
            >
              <i className="fa-solid fa-microchip mr-2 text-indigo-400"></i>
              Telemetria & Gêmeo Digital
            </a>
            <a
              href="#frota"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-200 hover:text-blue-400 py-2 border-b border-slate-800/60"
            >
              <i className="fa-solid fa-truck-monster mr-2 text-blue-400"></i>
              Parque de Máquinas Pesadas
            </a>
            <a
              href="#contato"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center w-full py-3 rounded-lg text-white font-bold bg-gradient-to-r from-blue-600 to-indigo-600 mt-4 shadow-lg shadow-blue-500/25"
            >
              <i className="fa-solid fa-file-contract mr-2"></i>
              SOLICITAR PROPOSTA B2B
            </a>
          </div>
        )}
      </header>

      {/* HERO SECTION CYBERPUNK */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Texto de Impacto */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/40 text-blue-400 text-xs font-mono tracking-wider shadow-inner">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                TECNOLOGIA INDUSTRIAL PESADA LOD 500
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Engenharia Pesada de Alta Complexidade com{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-400">
                  Gêmeos Digitais & Automação 5.0
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Execução de pontes estaiadas, túneis subterrâneos TBM, complexos portuários e hidroelétricas estratégicas. Precisão milimétrica guiada por telemetria IoT em tempo real, modelagem BIM 5D e equipamentos pesados de última geração.
              </p>

              {/* Botões de Ação Hero */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <a
                  href="#simulador"
                  className="px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 transition-all duration-300"
                >
                  <i className="fa-solid fa-calculator text-amber-300"></i>
                  <span>Simular Obra & Orçamento</span>
                </a>

                <a
                  href="#obras"
                  className="px-8 py-4 rounded-xl text-sm font-mono font-medium text-slate-300 bg-slate-900/80 border border-slate-700 hover:border-blue-500/70 hover:bg-slate-800/90 flex items-center justify-center gap-3 transition-all duration-300"
                >
                  <i className="fa-solid fa-cubes text-blue-400"></i>
                  <span>Explorar Mega Obras</span>
                </a>
              </div>

              {/* Badges de Garantia Técnica */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 text-center sm:text-left">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                    R$ 12.4<span className="text-blue-400">Bi+</span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">VGV Executado em Obras</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                    100<span className="text-amber-400">%</span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">BIM 5D & Telemetria IoT</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                    0.00<span className="text-emerald-400">%</span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">Desvio Estrutural Crítico</div>
                </div>
              </div>
            </div>

            {/* Painel Isométrico HUD / Terminal 3D Futurista */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-slate-900/90 border border-slate-700/80 p-5 shadow-2xl backdrop-blur-xl cyber-glow-blue">
                {/* Cabeçalho do HUD Terminal */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                    <span className="text-[11px] font-mono text-slate-400 ml-2">
                      KRONOS_TELEMETRY_CORE v5.4.1
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    LIVE STREAM
                  </span>
                </div>

                {/* Wireframe de Ponte / Estrutura em SVG */}
                <div className="relative h-56 rounded-xl bg-[#03060d] border border-slate-800/80 overflow-hidden flex items-center justify-center p-3">
                  <div className="absolute inset-0 cyber-grid-dense opacity-30"></div>
                  
                  {/* SVG Ilustração Estrutural Técnica */}
                  <svg className="w-full h-full text-blue-500/70" viewBox="0 0 500 240" fill="none">
                    {/* Linha do terreno / nível do mar */}
                    <path d="M 0 200 L 500 200" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />
                    {/* Pilares da Ponte */}
                    <rect x="130" y="40" width="16" height="160" fill="#1e3a8a" opacity="0.6" stroke="#3b82f6" strokeWidth="1.5" />
                    <rect x="350" y="40" width="16" height="160" fill="#1e3a8a" opacity="0.6" stroke="#3b82f6" strokeWidth="1.5" />
                    {/* Tabuleiro da ponte */}
                    <path d="M 10 140 L 490 140" stroke="#60a5fa" strokeWidth="4" />
                    {/* Estais de Aço */}
                    <line x1="138" y1="50" x2="30" y2="140" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 2" />
                    <line x1="138" y1="65" x2="60" y2="140" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 2" />
                    <line x1="138" y1="80" x2="95" y2="140" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 2" />
                    <line x1="138" y1="50" x2="240" y2="140" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 2" />
                    <line x1="138" y1="65" x2="210" y2="140" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 2" />
                    <line x1="138" y1="80" x2="180" y2="140" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 2" />

                    <line x1="358" y1="50" x2="260" y2="140" stroke="#818cf8" strokeWidth="1" strokeDasharray="3 2" />
                    <line x1="358" y1="65" x2="290" y2="140" stroke="#818cf8" strokeWidth="1" strokeDasharray="3 2" />
                    <line x1="358" y1="80" x2="320" y2="140" stroke="#818cf8" strokeWidth="1" strokeDasharray="3 2" />
                    <line x1="358" y1="50" x2="470" y2="140" stroke="#818cf8" strokeWidth="1" strokeDasharray="3 2" />
                    <line x1="358" y1="65" x2="440" y2="140" stroke="#818cf8" strokeWidth="1" strokeDasharray="3 2" />
                    <line x1="358" y1="80" x2="405" y2="140" stroke="#818cf8" strokeWidth="1" strokeDasharray="3 2" />

                    {/* Nós de telemetria IoT pulsantes */}
                    <circle cx="240" cy="140" r="4" fill="#f59e0b" className="animate-ping" />
                    <circle cx="240" cy="140" r="3" fill="#f59e0b" />
                    <circle cx="138" cy="50" r="3" fill="#3b82f6" />
                    <circle cx="358" cy="50" r="3" fill="#3b82f6" />
                    <circle cx="60" cy="140" r="3" fill="#10b981" />
                    <circle cx="440" cy="140" r="3" fill="#10b981" />
                  </svg>

                  {/* Overlay de Telemetria Flutuante */}
                  <div className="absolute top-2 left-2 text-[10px] font-mono bg-black/70 px-2 py-1 rounded border border-slate-700/80 text-blue-300">
                    VÃO CENTRAL: 780.00m
                  </div>
                  <div className="absolute top-2 right-2 text-[10px] font-mono bg-black/70 px-2 py-1 rounded border border-slate-700/80 text-amber-300">
                    DEFLEXÃO: -1.2mm (OK)
                  </div>
                  <div className="absolute bottom-2 left-2 text-[10px] font-mono bg-black/70 px-2 py-1 rounded border border-slate-700/80 text-emerald-300">
                    STATUS: TENSÃO DISTRIBUÍDA
                  </div>
                </div>

                {/* Métricas rápidas do nó */}
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">TRANSDUTOR DE FIBRA ÓPTICA</span>
                    <span className="text-white font-bold text-sm">4.820 µε</span>
                    <span className="text-emerald-400 text-[10px] block mt-0.5">Seguro (Margem 4.2x)</span>
                  </div>
                  <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">FREQUÊNCIA DE RESSONÂNCIA</span>
                    <span className="text-white font-bold text-sm">0.285 Hz</span>
                    <span className="text-blue-400 text-[10px] block mt-0.5">Dentro do Espectro</span>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <i className="fa-solid fa-server text-blue-500"></i>
                    BIM CLOUD FEDERADO
                  </span>
                  <button
                    onClick={() => {
                      setSelectedProjectModal(projects[0]);
                      showToast('Abrindo Gêmeo Digital da Obra Delta-09...', 'info');
                    }}
                    className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                  >
                    <span>Inspecionar Gêmeo</span>
                    <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO SIMULADOR B2B DE GRANDES OBRAS (NÚCLEO DE CONVERSÃO TÉCNICA) */}
      <section id="simulador" className="py-20 bg-[#070b18] border-y border-slate-800/90 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono mb-3">
              <i className="fa-solid fa-microchip"></i>
              ALGORITMO PREDITIVO DE ENGENHARIA PESADA
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Simulador Técnico de Investimento & Mobilização de Obra
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Ajuste as variáveis de engenharia pesada para obter estimativas de custo, maquinário crítico e modelagem BIM 5D com geração instantânea de briefing para reunião técnica.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Controles do Simulador */}
            <div className="lg:col-span-7 bg-slate-900/80 rounded-2xl border border-slate-800 p-6 sm:p-8 backdrop-blur-md space-y-6">
              {/* Seleção de Tipologia */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-2 font-semibold">
                  1. Tipologia da Mega-Obra
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'ponte', label: 'Pontes & Viadutos', icon: 'fa-solid fa-bridge' },
                    { id: 'tunel', label: 'Túneis & TBM', icon: 'fa-solid fa-circle-notch' },
                    { id: 'porto', label: 'Complexo Portuário', icon: 'fa-solid fa-ship' },
                    { id: 'energia', label: 'Hidrelétricas / Barragens', icon: 'fa-solid fa-bolt' },
                    { id: 'geotecnia', label: 'Geotecnia Profunda', icon: 'fa-solid fa-mountain' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSimType(item.id as any)}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        simType === item.id
                          ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <i className={`${item.icon} text-lg mb-2 ${simType === item.id ? 'text-amber-400' : 'text-slate-500'}`}></i>
                      <span className="text-xs font-semibold">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders de Variáveis Técnicas */}
              <div className="space-y-5 pt-2">
                {/* Volume de Escavação */}
                <div>
                  <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <i className="fa-solid fa-trowel-bricks text-blue-400"></i>
                      Volume de Escavação / Terraplenagem:
                    </span>
                    <span className="text-blue-400 font-bold text-sm">
                      {simExcavation.toLocaleString('pt-BR')} m³
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="10000"
                    value={simExcavation}
                    onChange={(e) => setSimExcavation(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                    <span>10.000 m³</span>
                    <span>500.000 m³</span>
                    <span>1.000.000 m³</span>
                  </div>
                </div>

                {/* Aço Estrutural */}
                <div>
                  <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <i className="fa-solid fa-cubes text-indigo-400"></i>
                      Aço Estrutural & Armaduras Especiais:
                    </span>
                    <span className="text-indigo-400 font-bold text-sm">
                      {simSteel.toLocaleString('pt-BR')} toneladas
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="50000"
                    step="500"
                    value={simSteel}
                    onChange={(e) => setSimSteel(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                    <span>1.000 t</span>
                    <span>25.000 t</span>
                    <span>50.000 t</span>
                  </div>
                </div>

                {/* Concreto Estrutural de Alta Resistência */}
                <div>
                  <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <i className="fa-solid fa-fill-drip text-amber-400"></i>
                      Concreto Estrutural CAD / CCR (fck &gt; 60MPa):
                    </span>
                    <span className="text-amber-400 font-bold text-sm">
                      {simConcrete.toLocaleString('pt-BR')} m³
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="300000"
                    step="5000"
                    value={simConcrete}
                    onChange={(e) => setSimConcrete(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                    <span>5.000 m³</span>
                    <span>150.000 m³</span>
                    <span>300.000 m³</span>
                  </div>
                </div>

                {/* Prazo Alvo em Meses */}
                <div>
                  <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <i className="fa-solid fa-timeline text-emerald-400"></i>
                      Prazo Alvo de Mobilização e Execução:
                    </span>
                    <span className="text-emerald-400 font-bold text-sm">
                      {simMonths} meses ({Math.round(simMonths / 12 * 10) / 10} anos)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="60"
                    step="2"
                    value={simMonths}
                    onChange={(e) => setSimMonths(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                    <span>12 meses</span>
                    <span>36 meses</span>
                    <span>60 meses</span>
                  </div>
                </div>
              </div>

              {/* Nível Tecnológico BIM / IoT */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-2 font-semibold">
                  2. Nível de Inteligência & Gêmeo Digital
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'bim4d', title: 'BIM 4D', desc: 'Planejamento e cronograma espacial parametrizado' },
                    { id: 'bim5d', title: 'BIM 5D', desc: 'Integração orçamentária e controle de suprimentos em tempo real' },
                    { id: 'twin', title: 'Gêmeo Digital + IoT', desc: 'Sensores de fibra óptica, LiDAR e monitoramento 24/7' },
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setSimBimTier(tier.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        simBimTier === tier.id
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/20'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <i className={`fa-solid ${simBimTier === tier.id ? 'fa-circle-dot text-indigo-400' : 'fa-circle text-slate-700'} text-[10px]`}></i>
                        {tier.title}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-tight">{tier.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Painel de Resultados do Simulador */}
            <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 via-slate-900 to-[#040712] rounded-2xl border border-blue-500/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative cyber-glow-blue">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-mono text-blue-400 tracking-wider">
                  KRONOS PREDIC_ENGINE // ESTIMATIVA
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  PRECISÃO CLASSE 2 (AACE)
                </span>
              </div>

              {/* Valor Total Estimado */}
              <div className="py-6 text-center border-b border-slate-800">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  Investimento Estimado de Implantação
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono mt-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-amber-300">
                  {formatCurrency(simulationResults.totalCost)}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-2">
                  Aporte Médio Mensal: <span className="text-slate-200 font-bold">{formatCurrency(simulationResults.monthlyBurn)} / mês</span>
                </div>
              </div>

              {/* Detalhes de Maquinário Crítico Alocado */}
              <div className="py-4 space-y-3 border-b border-slate-800 text-xs">
                <span className="font-mono text-slate-300 font-bold block flex items-center gap-1.5">
                  <i className="fa-solid fa-truck-pickup text-amber-400"></i>
                  Frota Crítica Recomendada:
                </span>
                <ul className="space-y-1.5">
                  {simulationResults.config.machinery.map((mach, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-slate-300 text-[11px] font-mono bg-slate-950/60 px-2.5 py-1.5 rounded border border-slate-800/80">
                      <i className="fa-solid fa-angles-right text-blue-400 text-[9px]"></i>
                      {mach}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sustentabilidade & Risco */}
              <div className="py-4 grid grid-cols-2 gap-3 text-xs font-mono border-b border-slate-800">
                <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">CARBONO COMPENSADO</span>
                  <span className="text-emerald-400 font-bold">{simulationResults.co2Reduction.toLocaleString('pt-BR')} tCO2e</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">GEOTECHNICAL RISK</span>
                  <span className="text-amber-400 font-bold">Monitoramento Ativo</span>
                </div>
              </div>

              {/* Botão de Disparo do WhatsApp */}
              <div className="pt-6">
                <button
                  type="button"
                  onClick={handleSimulatorWhatsApp}
                  className="w-full py-4 rounded-xl text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-3 transition-all duration-300"
                >
                  <i className="fa-brands fa-whatsapp text-lg"></i>
                  <span>Receber Estudo Completo no WhatsApp</span>
                </button>
                <p className="text-[10px] font-mono text-slate-400 text-center mt-2.5">
                  <i className="fa-solid fa-shield-halved mr-1 text-slate-500"></i>
                  Dados técnicos criptografados em conformidade com ISO 27001 e LGPD.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO PORTFÓLIO DE GRANDES OBRAS (MEGA INFRAESTRUTURAS) */}
      <section id="obras" className="py-24 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono mb-3">
                <i className="fa-solid fa-diagram-project"></i>
                PORTFÓLIO DE ALTA COMPLEXIDADE
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Grandes Obras de Infraestrutura Nacional
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
                Projetos que transformam a logística e matriz energética do continente, monitorados por nós de telemetria e gêmeos digitais integrados.
              </p>
            </div>

            {/* Filtros de Categoria */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'todos', label: 'Todos os Projetos' },
                { id: 'pontes', label: 'Pontes & Viadutos' },
                { id: 'tuneis', label: 'Túneis & Subterrâneo' },
                { id: 'portos', label: 'Portos & Off-shore' },
                { id: 'energia', label: 'Energia & Barragens' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
                    activeFilter === filter.id
                      ? 'bg-blue-600 text-white border border-blue-400 shadow-lg shadow-blue-500/25'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Cards de Obras */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-blue-500/60 transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:shadow-2xl hover:shadow-blue-500/10"
              >
                <div>
                  {/* Cabeçalho do Card */}
                  <div className="p-6 border-b border-slate-800/80 bg-gradient-to-r from-slate-950 to-slate-900">
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <span className="text-blue-400 font-bold">{project.code}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          project.status === 'Concluído'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5 mt-1">
                      <i className="fa-solid fa-location-dot text-rose-400 text-[11px]"></i>
                      {project.location}
                    </p>
                  </div>

                  {/* Corpo do Card */}
                  <div className="p-6 space-y-4">
                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Barra de Progresso Executivo */}
                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-slate-400">Avanço Físico-Financeiro</span>
                        <span className="text-white font-bold">{project.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-400 rounded-full transition-all duration-1000"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Especificações Técnicas */}
                    <div className="grid grid-cols-2 gap-2.5 text-[11px] font-mono pt-2">
                      <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800/80">
                        <span className="text-slate-500 block text-[9px]">CONCRETO ESTRUTURAL</span>
                        <span className="text-slate-200 font-semibold">{project.specs.concrete}</span>
                      </div>
                      <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800/80">
                        <span className="text-slate-500 block text-[9px]">AÇO / ARMADURAS</span>
                        <span className="text-slate-200 font-semibold">{project.specs.steel}</span>
                      </div>
                      <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800/80">
                        <span className="text-slate-500 block text-[9px]">ESCAVAÇÃO</span>
                        <span className="text-slate-200 font-semibold">{project.specs.excavation}</span>
                      </div>
                      <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800/80">
                        <span className="text-slate-500 block text-[9px]">INVESTIMENTO TOTAL</span>
                        <span className="text-amber-400 font-bold">{project.budget}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer do Card com Ação */}
                <div className="p-6 pt-0 border-t border-slate-800/60 mt-4 flex items-center justify-between">
                  <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                    <i className="fa-solid fa-satellite-dish text-blue-400"></i>
                    <span>{project.telemetry.iotNodes} Nós IoT</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedProjectModal(project);
                      showToast(`Carregando memorial técnico de ${project.title}...`, 'info');
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-mono font-semibold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/60 transition-all flex items-center gap-1.5"
                  >
                    <span>Dados BIM</span>
                    <i className="fa-solid fa-magnifying-glass text-[10px]"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL DETALHADO DO GÊMEO DIGITAL (BIM 5D) */}
      {selectedProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#070b18] border border-blue-500/50 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative">
            <button
              onClick={() => setSelectedProjectModal(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center"
              aria-label="Fechar modal"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-2">
              <i className="fa-solid fa-vr-cardboard"></i>
              GÊMEO DIGITAL INTERATIVO // {selectedProjectModal.code}
            </div>

            <h3 className="text-2xl font-extrabold text-white">
              {selectedProjectModal.title}
            </h3>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Localização: {selectedProjectModal.location} | Investimento Aprovado: {selectedProjectModal.budget}
            </p>

            {/* Simulação Isométrica 3D do Projeto Selecionado */}
            <div className="my-6 p-4 rounded-xl bg-slate-950 border border-slate-800 relative">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-2">
                <span>SENSOR GRID: {selectedProjectModal.telemetry.iotNodes} UNIDADES CONECTADAS</span>
                <span className="text-emerald-400">LATÊNCIA: 18ms</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-center">
                <div className="p-3 bg-slate-900/80 rounded border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">DEFORMAÇÃO ATUAL</span>
                  <span className="text-blue-400 font-bold">{selectedProjectModal.telemetry.strain}</span>
                </div>
                <div className="p-3 bg-slate-900/80 rounded border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">VIBRAÇÃO DINÂMICA</span>
                  <span className="text-indigo-400 font-bold">{selectedProjectModal.telemetry.vibration}</span>
                </div>
                <div className="p-3 bg-slate-900/80 rounded border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">TEMPERATURA NÚCLEO</span>
                  <span className="text-amber-400 font-bold">{selectedProjectModal.telemetry.temperature}</span>
                </div>
                <div className="p-3 bg-slate-900/80 rounded border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">INTEGRIDADE ESTRUTURAL</span>
                  <span className="text-emerald-400 font-bold">99.98%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <h4 className="font-bold text-white uppercase font-mono tracking-wider text-sm flex items-center gap-2">
                <i className="fa-solid fa-file-lines text-blue-400"></i>
                Memorial Descritivo & Desafios de Engenharia
              </h4>
              <p>{selectedProjectModal.description}</p>
              <p>
                O controle dimensional é garantido por receptores GNSS de dupla frequência com correções em tempo real por estações de base KRONOS e escaneamento LiDAR aerotransportado semanal para averiguação milimétrica do modelo as-built versus o projeto executivo original.
              </p>
            </div>

            {/* Ações do Modal */}
            <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={() => {
                  showToast('Memorial técnico baixado com sucesso no formato PDF/BIM.', 'success');
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-mono font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-file-pdf text-rose-400"></i>
                Baixar Relatório Executivo (PDF)
              </button>

              <a
                href={`https://api.whatsapp.com/send?phone=5511999998888&text=Ol%C3%A1%20KRONOS%2C%20tenho%20interesse%20em%20consultar%20detalhes%20da%20obra%20${encodeURIComponent(selectedProjectModal.title)}%20(${selectedProjectModal.code}).`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
              >
                <i className="fa-brands fa-whatsapp text-sm"></i>
                Falar com Engenheiro Chefe desta Obra
              </a>
            </div>
          </div>
        </div>
      )}

      {/* SEÇÃO PARQUE DE MÁQUINAS PESADAS E AUTÔNOMAS */}
      <section id="frota" className="py-24 bg-[#070b18] border-t border-slate-800/90 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono mb-3">
              <i className="fa-solid fa-truck-monster"></i>
              PARQUE TECNOLÓGICO DE ATIVOS PESADOS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Frota de Engenharia Pesada com Telemetria 24/7
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Mais de 180 equipamentos próprios de grande capacidade, equipados com telemetria via satélite, controle de fadiga e sensores de pressão hidráulica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {machineryFleet.map((machine) => (
              <div
                key={machine.id}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between hover:border-indigo-500/60 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-3">
                    <span className="text-indigo-400 font-bold">{machine.code}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {machine.telemetryStatus}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-indigo-400 mb-4 text-xl">
                    <i className={machine.icon}></i>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">
                    {machine.name}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono mt-1">
                    Categoria: {machine.category}
                  </div>

                  <div className="mt-4 space-y-1.5 text-xs font-mono text-slate-300 bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-[10px]">POTÊNCIA:</span>
                      <span className="text-white font-semibold">{machine.power}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-[10px]">CAPACIDADE:</span>
                      <span className="text-amber-400 font-semibold">{machine.capacity}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] font-mono grid grid-cols-3 gap-1 text-center text-slate-400">
                  <div>
                    <span className="text-[9px] text-slate-600 block">TEMP ÓLEO</span>
                    <span className="text-slate-300">{machine.sensorData.oilTemp}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-600 block">ROTAÇÃO</span>
                    <span className="text-slate-300">{machine.sensorData.rpm}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-600 block">HORÍMETRO</span>
                    <span className="text-slate-300">{machine.sensorData.hours}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO CERTIFICAÇÕES & COMPLIANCE (GARANTIA B2B) */}
      <section id="certificacoes" className="py-20 bg-[#050811] relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-3">
              <i className="fa-solid fa-award"></i>
              RIGOR NORMATIVO & CRITÉRIOS INTERNACIONAIS
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Certificações Técnicas & Conformidade Jurídica
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Auditorias independentes periódicas que asseguram padrão de qualidade internacional para consórcios públicos e privados.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                title: 'ISO 9001:2015',
                desc: 'Gestão da Qualidade Total em Obras Pesadas e Concreto Armado',
                icon: 'fa-solid fa-stamp',
                badge: 'Auditoria BVQI',
              },
              {
                title: 'ISO 14001:2015',
                desc: 'Gestão Ambiental & Compensação Rigorosa de Carbono',
                icon: 'fa-solid fa-leaf',
                badge: 'Sustentabilidade',
              },
              {
                title: 'ISO 45001:2018',
                desc: 'Saúde e Segurança Ocupacional com Zero Fatalidades',
                icon: 'fa-solid fa-helmet-safety',
                badge: 'Segurança Máxima',
              },
              {
                title: 'PBQP-H Nível A',
                desc: 'Qualificação Máxima no Programa Brasileiro de Produtividade',
                icon: 'fa-solid fa-building-columns',
                badge: 'Homologação Federal',
              },
            ].map((cert, idx) => (
              <div
                key={idx}
                className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 text-center flex flex-col items-center justify-between hover:border-emerald-500/40 transition-colors"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 flex items-center justify-center text-xl mb-4 mx-auto">
                    <i className={cert.icon}></i>
                  </div>
                  <h3 className="text-base font-bold text-white font-mono">{cert.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{cert.desc}</p>
                </div>
                <span className="mt-4 px-2.5 py-1 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  {cert.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO FORMULÁRIO DE RFP / CONTATO COMERCIAL B2B */}
      <section id="contato" className="py-24 bg-[#070b18] border-t border-slate-800 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Informações Comerciais */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono">
                <i className="fa-solid fa-handshake"></i>
                CANAL DE CONTRATAÇÃO CORPORATIVA
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Inicie a Análise de Engenharia do seu Projeto
              </h2>

              <p className="text-slate-300 text-sm leading-relaxed">
                Nossa diretoria de engenharia e modelagem BIM elabora planos de ataque, cronogramas executivos preliminares e matrizes de risco para licitações e consórcios privados em até 48 horas úteis.
              </p>

              <div className="space-y-4 pt-4 text-xs font-mono">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
                    <i className="fa-solid fa-building text-sm"></i>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">SEDE CORPORATIVA</span>
                    <span className="text-white font-semibold">Av. Engenheiro Luís Carlos Berrini, 1700 - Itaim Bibi, São Paulo - SP</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                    <i className="fa-brands fa-whatsapp text-sm"></i>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">CENTRAL DE LICITAÇÕES & CONSÓRCIOS</span>
                    <span className="text-white font-semibold">+55 (11) 99999-8888 / rfp@kronosinfra.com.br</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                    <i className="fa-solid fa-clock text-sm"></i>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">TIME DE PRONTIDÃO TÉCNICA</span>
                    <span className="text-white font-semibold">Monitoramento de Obras Ativas 24 Horas / 7 Dias</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulário de Envio com Validação e WhatsApp */}
            <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl border border-slate-700/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Solicitação de Proposta Técnica / RFP</h3>
                  <p className="text-xs text-slate-400">Preencha os dados estruturais do seu projeto</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  DISPARO VIA WHATSAPP
                </span>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Nome do Responsável *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Eng. Carlos Albuquerque"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Empresa / Consórcio *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Construtora Horizon S.A."
                      value={formData.empresa}
                      onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      E-mail Corporativo *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="carlos@empresa.com.br"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Telefone / WhatsApp com DDD *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(11) 98888-7777"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Tipologia de Obra
                    </label>
                    <select
                      value={formData.tipoObra}
                      onChange={(e) => setFormData({ ...formData, tipoObra: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option>Ponte / Viaduto Estaiado</option>
                      <option>Túnel Subterrâneo TBM</option>
                      <option>Complexo Portuário / Dragagem</option>
                      <option>Usina Hidrelétrica / Barragem</option>
                      <option>Geotecnia & Estabilização Crítica</option>
                      <option>Corredor Logístico / Ferrovia</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Orçamento Estimado
                    </label>
                    <select
                      value={formData.orcamento}
                      onChange={(e) => setFormData({ ...formData, orcamento: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option>R$ 20M a R$ 50M</option>
                      <option>R$ 50M a R$ 200M</option>
                      <option>R$ 200M a R$ 500M</option>
                      <option>Acima de R$ 500M (Mega-Obra)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Descrição do Desafio Geotécnico / Escopo da Obra
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Especifique extensão, condições do solo, prazos de licitação ou necessidades de maquinário pesado..."
                    value={formData.mensagem}
                    onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all duration-300"
                >
                  <i className="fa-brands fa-whatsapp text-lg"></i>
                  <span>Transmitir Solicitação Direta via WhatsApp</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CORPORATIVO */}
      <footer className="bg-[#03060c] border-t border-slate-800 text-slate-400 text-xs py-12 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800/80">
            {/* Coluna 1: Marca & Registro */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white text-sm">
                  <i className="fa-solid fa-cubes-stacked"></i>
                </div>
                <span className="text-lg font-black text-white tracking-widest font-sans">
                  KRONOS INFRA
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Engenharia Pesada, Infraestrutura Crítica e Gêmeos Digitais BIM 5D para Grandes Obras Públicas e Privadas.
              </p>
              <div className="font-mono text-[11px] text-slate-500">
                CREA/CONFEA PJ-94182/SP • CNPJ: 42.108.923/0001-90
              </div>
            </div>

            {/* Coluna 2: Divisões de Engenharia */}
            <div>
              <h4 className="font-bold text-white text-xs font-mono uppercase tracking-wider mb-3">
                Especialidades de Engenharia
              </h4>
              <ul className="space-y-2 text-slate-400 text-xs font-mono">
                <li>• Pontes Estaiadas & Viadutos</li>
                <li>• Túneis Escavados TBM Hard-Rock</li>
                <li>• Portos & Estruturas Hidráulicas</li>
                <li>• Fundações & Geotecnia Crítica</li>
                <li>• Barragens & Obras Hidroelétricas</li>
              </ul>
            </div>

            {/* Coluna 3: Níveis de Tecnologia */}
            <div>
              <h4 className="font-bold text-white text-xs font-mono uppercase tracking-wider mb-3">
                Pilares Tecnológicos
              </h4>
              <ul className="space-y-2 text-slate-400 text-xs font-mono">
                <li>• Modelagem Paramétrica BIM LOD 500</li>
                <li>• Telemetria Piezométrica por Fibra Óptica</li>
                <li>• Mapeamento Topográfico LiDAR RTK</li>
                <li>• Concretos Auto-Adensáveis CAD 80+</li>
                <li>• Monitoramento Preditivo de Deformação</li>
              </ul>
            </div>

            {/* Coluna 4: Certificações */}
            <div>
              <h4 className="font-bold text-white text-xs font-mono uppercase tracking-wider mb-3">
                Compliance & Selos
              </h4>
              <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  ISO 9001:2015
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  ISO 14001:2015
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  ISO 45001:2018
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-emerald-400">
                  PBQP-H Nível A
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-blue-400">
                  LEED Platinum Infra
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-4 font-mono">
                Políticas de ESG e Governança auditadas por PwC.
              </p>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500 gap-4">
            <div>
              © 2026 KRONOS HEAVY CYBER-INFRASTRUCTURE S.A. Todos os direitos reservados.
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-blue-400 transition-colors">Políticas de Privacidade</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Termos de Conformidade</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Segurança de Dados BIM</a>
            </div>
          </div>
        </div>
      </footer>

      {/* BOTÃO FLUTUANTE DE WHATSAPP RÁPIDO */}
      <a
        href="https://api.whatsapp.com/send?phone=5511999998888&text=Ol%C3%A1%20Engenharia%20KRONOS%2C%20gostaria%20de%20um%20atendimento%20t%C3%A9cnico%20para%20nova%20obra."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-40 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold shadow-2xl shadow-emerald-500/40 flex items-center gap-2.5 transition-all hover:scale-105"
        aria-label="Falar com Engenharia pelo WhatsApp"
      >
        <i className="fa-brands fa-whatsapp text-lg"></i>
        <span className="hidden sm:inline">ENG. DE PLANTÃO</span>
      </a>
    </div>
  );
}
