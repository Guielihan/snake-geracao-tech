// Script para limpar o ranking
// Copie e cole este código no console do navegador (F12) quando estiver na aplicação principal

const API_BASE_URL = 'https://snake-geracaotech.vercel.app/api';

async function limparRanking() {
    if (!confirm('Tem certeza que deseja limpar TODO o ranking? Esta ação não pode ser desfeita!')) {
        return;
    }

    try {
        console.log('Limpando ranking...');
        const response = await fetch(`${API_BASE_URL}/ranking`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro ${response.status}: ${response.statusText}. ${errorText}`);
        }

        const result = await response.json();
        console.log('✅ Ranking limpo com sucesso!', result);
        alert('✅ Ranking limpo com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao limpar ranking:', error);
        alert(`❌ Erro ao limpar ranking: ${error.message}`);
    }
}

async function verificarRanking() {
    try {
        const response = await fetch(`${API_BASE_URL}/ranking`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const count = data.rankings?.length || 0;
        console.log(`📊 Ranking atual: ${count} entrada(s)`, data.rankings);
        alert(`📊 Ranking atual: ${count} entrada(s)`);
    } catch (error) {
        console.error('❌ Erro ao verificar ranking:', error);
        alert(`❌ Erro ao verificar ranking: ${error.message}`);
    }
}

// Executar função
console.log('Funções disponíveis:');
console.log('- limparRanking() - Limpa todo o ranking');
console.log('- verificarRanking() - Verifica quantas entradas existem');
console.log('\nPara limpar o ranking, execute: limparRanking()');

