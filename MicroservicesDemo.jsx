import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, CreditCard, Package, Database, Send, Check, X } from 'lucide-react';

const services = [
  { id: 'users', name: 'Servicio de Usuarios', icon: User, color: 'from-blue-500 to-blue-600', position: { x: 50, y: 50 } },
  { id: 'payments', name: 'Servicio de Pagos', icon: CreditCard, color: 'from-purple-500 to-purple-600', position: { x: 50, y: 250 } },
  { id: 'inventory', name: 'Servicio de Inventario', icon: Package, color: 'from-indigo-500 to-indigo-600', position: { x: 50, y: 450 } },
  { id: 'database', name: 'Base de Datos', icon: Database, color: 'from-violet-500 to-violet-600', position: { x: 600, y: 250 } }
];

const scenarios = [
  {
    id: 1,
    name: 'Crear Usuario',
    description: 'El usuario se registra en el sistema',
    steps: [
      { from: 'users', to: 'database', message: 'Guardar usuario', delay: 0, status: 'success' },
      { from: 'database', to: 'users', message: 'Usuario creado ✓', delay: 1000, status: 'success' }
    ]
  },
  {
    id: 2,
    name: 'Procesar Compra',
    description: 'El usuario realiza una compra completa',
    steps: [
      { from: 'users', to: 'payments', message: 'Iniciar pago', delay: 0, status: 'success' },
      { from: 'payments', to: 'database', message: 'Verificar saldo', delay: 1000, status: 'success' },
      { from: 'database', to: 'payments', message: 'Saldo OK ✓', delay: 2000, status: 'success' },
      { from: 'payments', to: 'inventory', message: 'Reservar producto', delay: 3000, status: 'success' },
      { from: 'inventory', to: 'database', message: 'Actualizar stock', delay: 4000, status: 'success' },
      { from: 'database', to: 'inventory', message: 'Stock actualizado ✓', delay: 5000, status: 'success' },
      { from: 'inventory', to: 'users', message: 'Compra exitosa ✓', delay: 6000, status: 'success' }
    ]
  },
  {
    id: 3,
    name: 'Error de Inventario',
    description: 'Qué pasa cuando un servicio falla',
    steps: [
      { from: 'users', to: 'payments', message: 'Iniciar pago', delay: 0, status: 'success' },
      { from: 'payments', to: 'inventory', message: 'Reservar producto', delay: 1000, status: 'success' },
      { from: 'inventory', to: 'database', message: 'Verificar stock', delay: 2000, status: 'success' },
      { from: 'database', to: 'inventory', message: 'Sin stock ✗', delay: 3000, status: 'error' },
      { from: 'inventory', to: 'payments', message: 'Producto no disponible', delay: 4000, status: 'error' },
      { from: 'payments', to: 'users', message: 'Compra cancelada ✗', delay: 5000, status: 'error' }
    ]
  }
];

export default function MicroservicesDemo() {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [activeMessages, setActiveMessages] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);

  const runScenario = (scenario) => {
    setSelectedScenario(scenario);
    setActiveMessages([]);
    setCompletedSteps([]);
    setIsAnimating(true);

    scenario.steps.forEach((step, index) => {
      setTimeout(() => {
        setActiveMessages(prev => [...prev, { ...step, id: Date.now() + index }]);
        
        setTimeout(() => {
          setCompletedSteps(prev => [...prev, index]);
          setActiveMessages(prev => prev.filter(msg => msg.id !== (Date.now() + index)));
          
          if (index === scenario.steps.length - 1) {
            setTimeout(() => {
              setIsAnimating(false);
              setCompletedSteps([]);
            }, 2000);
          }
        }, 800);
      }, step.delay);
    });
  };

  const getServicePosition = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.position : { x: 0, y: 0 };
  };

  const calculateMessagePath = (from, to) => {
    const fromPos = getServicePosition(from);
    const toPos = getServicePosition(to);
    return {
      startX: fromPos.x + 150,
      startY: fromPos.y + 50,
      endX: toPos.x + 150,
      endY: toPos.y + 50
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            Arquitectura de Microservicios
          </h1>
          <p className="text-xl text-purple-200">
            Visualización interactiva de comunicación entre servicios
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Panel de Escenarios */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-purple-300/20">
              <h2 className="text-2xl font-bold text-white mb-6">Escenarios</h2>
              <div className="space-y-4">
                {scenarios.map((scenario) => (
                  <motion.button
                    key={scenario.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => !isAnimating && runScenario(scenario)}
                    disabled={isAnimating}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      selectedScenario?.id === scenario.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-xl'
                        : 'bg-white/5 hover:bg-white/10'
                    } ${isAnimating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Send className="w-5 h-5 text-white" />
                      <h3 className="font-bold text-white">{scenario.name}</h3>
                    </div>
                    <p className="text-sm text-purple-200">{scenario.description}</p>
                    <p className="text-xs text-purple-300 mt-2">{scenario.steps.length} pasos</p>
                  </motion.button>
                ))}
              </div>

              {isAnimating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 p-4 bg-blue-500/20 rounded-lg border border-blue-400/30"
                >
                  <div className="flex items-center gap-2 text-white">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    <span className="text-sm">Ejecutando escenario...</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Leyenda */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-purple-300/20"
            >
              <h3 className="text-lg font-bold text-white mb-4">Leyenda</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg" />
                  <span className="text-sm text-purple-200">Mensaje exitoso</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg" />
                  <span className="text-sm text-purple-200">Mensaje de error</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Área de Visualización */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-purple-300/20 relative overflow-hidden">
              <div className="relative" style={{ height: '600px' }}>
                {/* Servicios */}
                {services.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    style={{
                      position: 'absolute',
                      left: `${service.position.x}px`,
                      top: `${service.position.y}px`
                    }}
                    className="w-72"
                  >
                    <div className={`bg-gradient-to-r ${service.color} p-6 rounded-2xl shadow-2xl`}>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                          <service.icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg">{service.name}</h3>
                          <p className="text-white/70 text-sm">Servicio independiente</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Mensajes Animados */}
                <AnimatePresence>
                  {activeMessages.map((message) => {
                    const path = calculateMessagePath(message.from, message.to);
                    const angle = Math.atan2(path.endY - path.startY, path.endX - path.startX);

                    return (
                      <motion.div
                        key={message.id}
                        initial={{ x: path.startX, y: path.startY, opacity: 0 }}
                        animate={{ x: path.endX, y: path.endY, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        style={{
                          position: 'absolute',
                          transform: `rotate(${angle}rad)`
                        }}
                      >
                        <div className={`px-4 py-2 rounded-lg shadow-xl backdrop-blur-sm ${
                          message.status === 'error'
                            ? 'bg-gradient-to-r from-red-500 to-orange-500'
                            : 'bg-gradient-to-r from-blue-500 to-purple-500'
                        }`}>
                          <div className="flex items-center gap-2">
                            {message.status === 'error' ? (
                              <X className="w-4 h-4 text-white" />
                            ) : (
                              <Send className="w-4 h-4 text-white" />
                            )}
                            <span className="text-white text-sm font-medium whitespace-nowrap">
                              {message.message}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Conexiones permanentes */}
                <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
                  {services.map((fromService, i) => 
                    services.slice(i + 1).map((toService) => {
                      const fromPos = fromService.position;
                      const toPos = toService.position;
                      return (
                        <line
                          key={`${fromService.id}-${toService.id}`}
                          x1={fromPos.x + 150}
                          y1={fromPos.y + 50}
                          x2={toPos.x + 150}
                          y2={toPos.y + 50}
                          stroke="rgba(139, 92, 246, 0.2)"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                        />
                      );
                    })
                  )}
                </svg>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Información adicional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-purple-300/20"
        >
          <h2 className="text-2xl font-bold text-white mb-4">¿Qué son los Microservicios?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                <Check className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-white font-bold mb-2">Independientes</h3>
              <p className="text-purple-200 text-sm">Cada servicio funciona por separado y puede actualizarse sin afectar a los demás</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3">
                <Send className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-white font-bold mb-2">Comunicación</h3>
              <p className="text-purple-200 text-sm">Los servicios se comunican entre sí mediante mensajes y APIs</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-3">
                <Package className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-white font-bold mb-2">Escalables</h3>
              <p className="text-purple-200 text-sm">Puedes escalar solo los servicios que más se usan sin tocar los demás</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}