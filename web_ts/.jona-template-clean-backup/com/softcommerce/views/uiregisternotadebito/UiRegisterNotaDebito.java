package com.softcommerce.views.uiregisternotadebito;

import com.softcommerce.views.uipaneltfnotadebito.UiPanelTFNotaDebito;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Anexo;
import com.softcommerce.beans.Localidad;
import com.softcommerce.beans.BeanMoneda;
import com.softcommerce.beans.BeanMotivoNota;
import com.softcommerce.beans.PuntoVenta;
import com.softcommerce.beans.ContaCab;
import com.softcommerce.beans.Usuario;
import com.softcommerce.beans.UsuarioCorrelativo;
import com.softcommerce.beans.ContaItem;
import com.softcommerce.beans.BeanParametro;
import com.softcommerce.beans.BeanParametroProv;
import com.softcommerce.beans.BeanTipoCambio;
import com.softcommerce.beans.TipoOperacion;
import com.softcommerce.comboboxmodel.ComboModelFormaPago;
import com.softcommerce.entity.RegcontaCab;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import com.softcommerce.general.controles.CComboBox;
import com.softcommerce.iconos.Gif;
import java.awt.Component;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.ItemEvent;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.Color;
import java.awt.Font;
import java.util.Date;
import javax.swing.JButton;
import javax.swing.JComponent;
import javax.swing.JTextField;
import javax.swing.KeyStroke;
import javax.swing.SwingConstants;
import javax.swing.event.TableModelEvent;
import com.softcommerce.reglasnegocio.RnLocalidad;
import java.util.ArrayList;
import javax.swing.JFrame;
import javax.swing.JPanel;
import com.softcommerce.general.controles.JHInternal;
import com.softcommerce.general.herramientas.CFunciones;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.DoubleDocument;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import java.awt.Dimension;
import java.awt.Toolkit;
import java.awt.event.FocusListener;
import java.awt.event.ItemListener;
import java.util.List;
import javax.swing.JCheckBox;
import javax.swing.JLabel;
import javax.swing.JScrollPane;
import javax.swing.event.TableModelListener;
import com.softcommerce.reglasnegocio.RnAnexo;
import com.softcommerce.general.tablas.NotaDebitoRegistroTableModel;
import com.softcommerce.logic.LogicRegContaCab;
import com.softcommerce.reglasnegocio.rn_MotivoNotaCredito;
import com.softcommerce.reglasnegocio.RnPuntoVenta;
import com.softcommerce.reglasnegocio.RnCorrelativo;
import com.softcommerce.reglasnegocio.RnParametro;
import com.softcommerce.reglasnegocio.RnParametroProv;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import com.softcommerce.reglasnegocio.RnTipoCambio;
import com.softcommerce.reglasnegocio.RnTipoOperacion;
import com.softcommerce.report.Reporte;
import com.softcommerce.util.CompareDate;
import com.softcommerce.util.Constans;
import com.softcommerce.util.combo.LoadCombo;
import com.softcommerce.util.FEtxt;
import com.softcommerce.util.Util;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.JComboBox;
import javax.swing.JOptionPane;

public class UiRegisterNotaDebito
        extends JHInternal
        implements InterUiRegisterNotaDebito, KeyListener, ActionListener, FocusListener, ItemListener, TableModelListener {
    protected final org.apache.log4j.Logger logger = org.apache.log4j.Logger.getLogger(UiRegisterNotaDebito.class);
    private static final long serialVersionUID = 1L;
    protected CComboBox cbo_idlocalidad;
    protected List<Localidad> x_idlocalidad;
    protected JLabel lblFechaVenc;
    protected JDateChooser dc_fechafin;
    protected CComboBox cbo_idtipodocumento;
    protected CComboBox cbo_idmovimiento;
    protected List<BeanMotivoNota> x_idmovimiento;
    protected CComboBox cbo_serie;
    protected List<UsuarioCorrelativo> x_serie;
    protected CComboBox cbo_idpuntoventa;
    protected List<PuntoVenta> x_idpuntoventa;
    protected CComboBox cbo_idmoneda;
    protected List<BeanMoneda> xmoneda = new ArrayList();
    protected JTextField txtTipoCambio;
    protected JTextField txt_idregconta;
    protected JTextField txt_tmpanexo;
    protected JTextField txt_idanexo;
    protected JTextField txt_tmpruc;
    protected JTextField txt_noafecto;
    protected JTextField txt_igv;
    protected JTextField txt_afecto;
    protected JTextField txt_total;
    protected JTextField txt_monto;
    protected JTextField txt_percepcion;
    protected JTextField txt_idregconta_ref;
    protected JTextField txt_tmpdireccion;
    protected JTextField txt_glosa;
    protected JTextField txt_preimpreso;
    protected JTextField txt_preimpresoref;
    protected JTextField txt_idtipooperacion;
    protected JTextField txt_serieref;
    protected JComboBox txt_idcondicionventa;
    protected JDateChooser dc_fechainicio;
    protected JButton btn_buscar;
    protected Usuario usuario;
    protected JFrame frame;
    protected JCheckBox chk_igv;
    protected JScrollPane scp_xdescuento;
    protected NotaDebitoRegistroTableModel mdl_xdescuento;
    protected CTable tbl_xdescuento;
    protected JTextField txt_idconcepto;
    protected JTextField txt_concepto;
    protected JTextField txt_cuenta;
    protected JButton btn_buscarconcepto;
    protected JTextField txt_importe;
    protected JTextField txt_importeIGV;
    protected JLabel lblconcepto;
    protected JLabel lblimporte;
    protected JLabel lbligv;
    protected JLabel lbltipooperacion;
    protected JLabel lbl_condventa;
    protected JButton btn_buscar_cliente;
    protected Date fechaRef = new Date();
    protected RegcontaCab beanReferencia;
    protected ComboModelFormaPago modelFormaPago = new ComboModelFormaPago();

    public UiRegisterNotaDebito(UiPanelTFNotaDebito pnltfnotacredito, String title, Usuario usuario, JFrame frame) {
        super(title);
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    protected void inicialize() {
    }
    ItemListener itemListener = new ItemListener() {
        @Override
        public void itemStateChanged(ItemEvent e) {
            if (txt_idcondicionventa.equals(e.getSource())) {
                try {
                    if (txt_idcondicionventa.getSelectedItem().toString().equalsIgnoreCase("CO")) {
                        dc_fechafin.setVisible(false);
                        lblFechaVenc.setVisible(false);
                    } else if (txt_idcondicionventa.getSelectedItem().toString().equalsIgnoreCase("CR")) {
                        dc_fechafin.setVisible(true);
                        lblFechaVenc.setVisible(true);
                    }
                } catch (Exception ex) {
                    dc_fechafin.setVisible(false);
                    lblFechaVenc.setVisible(false);
                }
            }
        }
    };

    @Override
    public void loadCombo() {
    }

    public void loadMovimiento() {
    }

    public void loadLocalidad(String xcodEmpres) {
    }

    public void loadPuntoVenta(String xcodLocalidad) {
    }

    public void loadtipoDocumento() {
    }

    public void loadMoneda() {
    }

    @Override
    public void newRegister() {
    }

    public void setFormato(String cod) {
        boolean e = false;
        scp_xdescuento.setVisible(cod.equals("012") ? !e : e);
        lblconcepto.setVisible(cod.equals("011") ? !e : e);
        txt_idconcepto.setVisible(cod.equals("011") ? !e : e);
        txt_concepto.setVisible(cod.equals("011") ? !e : e);
        txt_cuenta.setVisible(cod.equals("011") ? !e : e);
        btn_buscarconcepto.setVisible(cod.equals("011") ? !e : e);
        txt_importe.setVisible(cod.equals("011") ? !e : e);
        lbligv.setVisible(cod.equals("011") ? false : e);
        txt_importeIGV.setVisible(cod.equals("011") ? false : e);
        chk_igv.setVisible(cod.equals("011") ? false : e);
        newRegister();
    }

    public void cargarMoneda(String codMoneda) {
    }

    public void cargarLocalidad(String xcodiLocalidad) {
    }

    public void cargarPuntoVenta(String codPuntoVenta) {
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }

    protected void cargarCliente(Anexo a) {
    }

    protected void cargarConcepto(String id_parametro_prov) {
    }

    @Override
    public boolean loadRegister() {
        return false;
    }

    protected void cargarDocumentoReferencia(ContaCab r) {
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        boolean isSelect;

        isSelect = (e.getStateChange() == ItemEvent.SELECTED);

        if (e.getItemSelectable() == chk_igv) {
            calcularMontos();
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if (e.getSource() == txt_importe) {
            calcularMontos();
        }
    }

    protected void calcularMontos() {
    }

    public void mostrarPreimpreso() {
    }

    protected String getNameFile(String idTipoDoc, ContaCab beanRcc) {
        return this.usuario.getRuc() + "-" + idTipoDoc + "-" + beanRcc.getSerie() + "-" + beanRcc.getPreimpreso8Digs();
    }

    protected void exportarTxt(ContaCab beanRcc) {
    }

    @Override
    public String executeInsert() {
        return null;
    }

    protected String getPrint(String codigo) {
        String parametro = "SELECT "
                + " ND.TMP_ANEXO AS TMP_ANEXO "
                + " ,ND.TMP_DIRECCION as TMP_DIRECCION "
                + " ,ND.TMP_RUC AS TMP_RUC "
                + " ,EXTRACT(YEAR FROM TO_DATE(ND.F_EMISION,'DD/MM/YY HH24:MI:SS')) AS ANIO "
                + " ,EXTRACT(MONTH FROM TO_DATE(ND.F_EMISION,'DD/MM/YY HH24:MI:SS')) AS MES "
                + " ,EXTRACT(DAY FROM TO_DATE(ND.F_EMISION,'DD/MM/YY HH24:MI:SS')) AS DIA "
                + " ,ND.GLOSA AS GLOSA "
                + " ,ND.M_IGV AS M_IGV"
                + " ,ND.M_AFECTO AS M_AFECTO"
                + " ,ND.MONTO AS MONTO"
                + " ,PP.DESCRIPCION AS CONCEPTO"
                + " FROM REGCONTA_CAB ND "
                + " LEFT JOIN PARAMETRO_PROV PP ON ND.ID_PARAMETRO_PROV = PP.ID_PARAMETRO_PROV "
                + "  WHERE 1 = 1 "
                + " AND ND.\"_ESTADO\" = 'A' "
                + " AND ND.ID_REGCONTA = \'" + codigo + "\' ";

        return parametro;
    }

    @Override
    public void showMessagePrint(String codigo) {
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == ((JTextFieldDateEditor) dc_fechainicio.getDateEditor())) {
            ((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).selectAll();
        }

        if (e.getSource() == txt_preimpreso) {
            txt_preimpreso.selectAll();
        }

        if (e.getSource() == txt_serieref) {
            txt_serieref.selectAll();
        }

        if (e.getSource() == txt_preimpresoref) {
            txt_preimpresoref.selectAll();
        }

        if (e.getSource() == txt_glosa) {
            txt_glosa.selectAll();
        }
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txt_preimpreso && txt_preimpreso.getText().trim().length() > 0) {
            String serie = "0000000000" + txt_preimpreso.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 10, serie.length());
            txt_preimpreso.setText(nuevaserie);
        }

        if (e.getSource() == txt_preimpresoref && txt_preimpresoref.getText().trim().length() > 0) {
            String serie = "0000000000" + txt_preimpresoref.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 10, serie.length());
            txt_preimpresoref.setText(nuevaserie);
        }

        if (e.getSource() == txt_glosa && txt_glosa.getText().trim().length() == 0) {
            txt_glosa.setText(cbo_idmovimiento.getSelectedItem().toString());
        }
    }

    @Override
    public void setRegisterEditable(boolean e) {
        tbl_xdescuento.setColumnEditable(6, e);
        tbl_xdescuento.setColumnEditable(15, e);
        txt_preimpreso.setEditable(e);
        txt_serieref.setEditable(!e);
        txt_preimpresoref.setEditable(!e);
        txt_glosa.setEditable(e);
    }

    @Override
    public void setRegisterEnabled(boolean e) {
        cbo_idmovimiento.setEnabled(e);
        cbo_serie.setEnabled(e);
        cbo_idtipodocumento.setEnabled(!e);
        btn_buscar.setEnabled(e);
        dc_fechainicio.setEnabled(e);
    }

    public void loadSerieCorrelativo(String id_tipodoc) {
    }

    public void prepareRegister() {
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (btn_buscar_cliente == e.getSource()) {
            Anexo a = new Anexo();
            a.setIdEmpresa(usuario.getCodempresa());
            a.setIdTipoAnexo("2");

            BuscarCliente buscar_cliente;
            buscar_cliente = new BuscarCliente(frame, this, path);
            buscar_cliente.cargarTabla(a, btn_buscar_cliente, 0);
        }

        if (cbo_idmovimiento == e.getSource()) {
            if (cbo_idmovimiento.getItemCount() > 0) {
                setFormato(x_idmovimiento.get(cbo_idmovimiento.getSelectedIndex()).getId_motivo());
            }
        }

        if (e.getSource() == btn_buscar) {
            BuscarNCDocumentosVentaND a = new BuscarNCDocumentosVentaND(frame, this, usuario, path);
            a.cargarTabla(btn_buscar);
        }

        if (e.getSource() == btn_buscarconcepto) {
            BuscarParametroProv a = new BuscarParametroProv(frame, this, path);
            a.cargarTabla(usuario.getCodempresa(), btn_buscarconcepto, 0);
        }

        if (cbo_idlocalidad == e.getSource()) {
            if (cbo_idlocalidad.getItemCount() > 0) {
                if (cbo_idlocalidad.getSelectedIndex() == 0) {
                    cbo_idpuntoventa.removeAllItems();
                } else {
                    loadPuntoVenta(x_idlocalidad.get(cbo_idlocalidad.getSelectedIndex() - 1).getId_localidad());
                }
            }
        }

        if (cbo_serie == e.getSource() && mode == INSERT) {
            if (cbo_serie.getSelectedIndex() > -1) {
                mostrarPreimpreso();
            }
        }

    }

    @Override
    public void tableChanged(TableModelEvent e) {
        if (e.getSource() == mdl_xdescuento) {
            calcularImportesDescuento();
        }
    }

    public void calcularImportesDescuento() {
    }

    public void calcularImportesDescuentoAntiguo() {
    }

    @Override
    public boolean isRegisterValid() {
        return false;
    }

    @Override
    public boolean executeDelete() {
        return false;
    }

    @Override
    public void showMessageSuccessfulInsert() {
    }

    @Override
    public void showMessageSuccessfulUpdate() {
    }

    @Override
    public void showMessageSuccessfulDelete() {
    }

    @Override
    public void showMessageErrorDelete() {
    }

    @Override
    public void showMessageErrorUpdate() {
    }

    @Override
    public void showMessageErrorInsert() {
    }

    @Override
    public String executeUpdate() {
        return null;
    }

    @Override
    public boolean executeAnular() {
        return false;
    }

    @Override
    public boolean executeSelect() {
        return false;
    }

    @Override
    public void onPressEsc() {
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void keyPressed(KeyEvent e) {
    }
}

