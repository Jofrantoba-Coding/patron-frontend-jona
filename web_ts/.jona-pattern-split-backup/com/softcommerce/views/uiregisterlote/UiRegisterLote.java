/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiregisterlote;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanLaboratorioClinico;
import com.softcommerce.beans.BeanUbicacion;
import com.softcommerce.beans.ContaItem;
import com.softcommerce.beans.Lote;
import com.softcommerce.conta.tablas.TableModelLote;
import com.softcommerce.general.tablas.DocumentoVentaDetalleTableModel;
import com.softcommerce.general.tablas.IngresoDevolucionDespachadoTableModel;
import com.softcommerce.general.tablas.OrdenCompraDetalleTableModel;
import com.softcommerce.util.editor.CellEditorBtnLote;
import com.softcommerce.util.Constans;
import com.softcommerce.util.FrmPanel;
import com.softcommerce.util.Imagenes;
import com.softcommerce.util.Util;
import com.softcommerce.util.UtilDate;
import java.awt.BorderLayout;
import java.awt.Frame;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Iterator;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JTextField;

public class UiRegisterLote extends JDialog  implements InterUiRegisterLote {

    private FrmPanel panelMolde;
    public TableModelLote modelLote;
    private JButton btnAdd;
    private JButton btnCommit;
    private JButton btnRollback;
    private ContaItem bean;
    private JTextField txtTotalaIngresar;
    private JTextField txtPendiente;
    private OrdenCompraDetalleTableModel modelCompra;
    private IngresoDevolucionDespachadoTableModel modelDevolucion;
    private DocumentoVentaDetalleTableModel modelEntradaAjuste;
    private BigDecimal sum = BigDecimal.ZERO;
    private CellEditorBtnLote cellEditor;
    private String idAlmacen;

    public UiRegisterLote(Frame owner, String titulo, boolean value, ContaItem bean, OrdenCompraDetalleTableModel model, CellEditorBtnLote cellEditor, String idAlmacen) {
        super(owner, titulo, value);
        this.bean = bean;
        this.modelCompra = model;
        this.cellEditor = cellEditor;
        this.idAlmacen = idAlmacen;
        panelMolde = new FrmPanel(null, bean.getItem_descripcion());
        txtTotalaIngresar = new JTextField();
        txtPendiente = new JTextField();
        modelLote = new TableModelLote(panelMolde.getTablaDatos(), txtTotalaIngresar, txtPendiente);
        initComponents();
    }

    public UiRegisterLote(Frame owner, String titulo, boolean value, ContaItem bean, IngresoDevolucionDespachadoTableModel model, CellEditorBtnLote cellEditor, String idAlmacen) {
        super(owner, titulo, value);
        this.bean = bean;
        this.modelDevolucion = model;
        this.cellEditor = cellEditor;
        this.idAlmacen = idAlmacen;
        panelMolde = new FrmPanel(null, bean.getItem_descripcion());
        txtTotalaIngresar = new JTextField();
        txtPendiente = new JTextField();
        modelLote = new TableModelLote(panelMolde.getTablaDatos(), txtTotalaIngresar, txtPendiente);
        initComponents();
        btnAdd.setVisible(false);
    }

    public UiRegisterLote(Frame owner, String titulo, boolean value, ContaItem bean, DocumentoVentaDetalleTableModel model, CellEditorBtnLote cellEditor, String idAlmacen) {
        super(owner, titulo, value);
        this.bean = bean;
        this.modelEntradaAjuste = model;
        this.cellEditor = cellEditor;
        this.idAlmacen = idAlmacen;
        panelMolde = new FrmPanel(null, bean.getItem_descripcion());
        txtTotalaIngresar = new JTextField();
        txtPendiente = new JTextField();
        modelLote = new TableModelLote(panelMolde.getTablaDatos(), txtTotalaIngresar, txtPendiente);
        initComponents();
    }

    private void initComponents() {
        this.getContentPane().setLayout(new BorderLayout());
        this.add(panelMolde);
        Imagenes img = new Imagenes();
        btnAdd = new JButton(img.getIconAgregar());
        btnCommit = new JButton(img.getIconCommit());
        btnRollback = new JButton(img.getIconRollback());
        btnAdd.setToolTipText("Agregar nuevo registro");
        btnCommit.setToolTipText("Confirmar operaciones");
        btnRollback.setToolTipText("Actualizar");
        panelMolde.getBarraBusqueda().add(btnAdd);
        panelMolde.getBarraBusqueda().add(btnCommit);
        panelMolde.getBarraBusqueda().add(btnRollback);
        btnAdd.addActionListener(actionListener);
        btnRollback.addActionListener(actionListener);
        btnCommit.addActionListener(actionListener);
        panelMolde.getTablaDatos().setRowHeight(30);
        txtTotalaIngresar.setColumns(8);
        txtPendiente.setColumns(8);
        txtTotalaIngresar.setEditable(false);
        txtPendiente.setEditable(false);
        if (modelCompra != null) {
            txtPendiente.setText(String.valueOf(this.bean.getTransito()));
        }
        if (modelDevolucion != null) {
            txtPendiente.setText(String.valueOf(this.bean.getCant_pordevolver_cliente()));
        }
        if (modelEntradaAjuste != null) {
            txtPendiente.setText(String.valueOf(this.bean.getTransito()));
        }
        panelMolde.getBarraFooter().add(new JLabel("Cantidad Pendiente: "));
        panelMolde.getBarraFooter().add(txtPendiente);
        panelMolde.getBarraFooter().addSeparator();
        panelMolde.getBarraFooter().add(new JLabel("Cantidad a Ingresar: "));
        panelMolde.getBarraFooter().add(txtTotalaIngresar);
    }

    private void nuevoRegistro() {
        try {
            BeanLaboratorioClinico lab = new BeanLaboratorioClinico();
            BeanUbicacion ubi = new BeanUbicacion();
            Lote lote = new Lote();
            lote.setIdLote(BigDecimal.valueOf(new java.util.Date().getTime()));
            lote.setBeanLaboratorio(lab);
            lote.setBeanUbicacion(ubi);
            lote.setEstadoOperacion("i");
            modelLote.getData().add(lote);
            modelLote.fireTableDataChanged();
            panelMolde.getTablaDatos().changeSelection(modelLote.getRowCount() - 1, 1, true, true);
            panelMolde.getTablaDatos().editCellAt(modelLote.getRowCount() - 1, 1);
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }
    }

    public void actualizarTablaLote() {
        modelLote.setData(bean.getListaLotes(), this.idAlmacen);
    }

    public boolean isValidaData() {
        if (BigDecimal.valueOf(Double.parseDouble(txtTotalaIngresar.getText())).compareTo(BigDecimal.valueOf(Double.parseDouble(txtPendiente.getText()))) == 1 || BigDecimal.valueOf(Double.parseDouble(txtTotalaIngresar.getText())).compareTo(BigDecimal.ZERO) == -1) {
            JOptionPane.showMessageDialog(null, "La cantidad maxima a ingresar es de " + txtPendiente.getText() + " items");
            return false;
        }
        BigDecimal sumAux = BigDecimal.ZERO;
        Iterator<Lote> i = modelLote.getData().iterator();
        while (i.hasNext()) {
            Lote bean = i.next();
            if (Constans.ES_OBLIGATORIO_UBICACION) {
                if (bean.getIdUbicacion() == null) {
                    JOptionPane.showMessageDialog(null, "Complete las ubicaciones");
                    return false;
                }
            }
            if (bean.getIdLaboratorio() == null) {
                JOptionPane.showMessageDialog(null, "Complete los Fabricantes");
                return false;
            }
            if (bean.getNumero() == null || bean.getNumero().isEmpty()) {
                JOptionPane.showMessageDialog(null, "Complete los # de Lotes");
                return false;
            }

            if (bean.getCantidad() == null || bean.getCantidad().compareTo(BigDecimal.ZERO) == 0) {
                JOptionPane.showMessageDialog(null, "Complete cantidades mayores a cero");
                return false;
            }
            if (!bean.isNoExpira()) {
                if (bean.getFechaCaducidad() == null) {
                    JOptionPane.showMessageDialog(null, "Complete las fechas de caducidad");
                    return false;
                }
            }
            sumAux = sumAux.add(bean.getCantidad());
        }
        sum = sumAux;
        return true;
    }

    ActionListener actionListener = new ActionListener() {

        @Override
        public void actionPerformed(ActionEvent e) {
            if (btnAdd.equals(e.getSource())) {
                nuevoRegistro();
            } else if (btnRollback.equals(e.getSource())) {
                actualizarTablaLote();
            } else if (btnCommit.equals(e.getSource())) {
                if (isValidaData()) {
                    bean.setListaLotes(modelLote.getData());
                    bean.setTieneLotes();
                    bean.setCantidad_string(sum.toString());
                    if (bean.getListaLotes() != null && bean.getListaLotes().size() > 0) {
                        bean.setXmlLotes(getXmlLotes(bean.getListaLotes()));
                    }
                    if (modelCompra != null) {
                        modelCompra.fireTableDataChanged();
                    }
                    if (modelDevolucion != null) {
                        modelDevolucion.fireTableDataChanged();
                    }
                    cellEditor.btn.setText(sum.toString());
                    cellEditor.stopCellEditing();
                    dispose();
                }
            }
        }

    };

    private String getXmlLotes(ArrayList<Lote> arrayLotes) {
        Iterator<Lote> iterador = arrayLotes.iterator();
        StringBuilder builder = new StringBuilder();
        builder.append("<?xml version=\"1.0\" ?> ");
        builder.append("<LOTES>");
        while (iterador.hasNext()) {
            Lote beanLote = iterador.next();
            builder.append("<LOTE>");
            builder.append("<IDLOTE>");
            builder.append(beanLote.getIdLote());
            builder.append("</IDLOTE>");
            builder.append("<NUMERO>");
            builder.append(beanLote.getNumero());
            builder.append("</NUMERO>");
            builder.append("<SERIE>");
            builder.append(beanLote.getSerie());
            builder.append("</SERIE>");
            builder.append("<CANTIDAD>");
            builder.append(Util.getNumberXml(beanLote.getCantidad()));
            builder.append("</CANTIDAD>");
            builder.append("<SALDO>");
            builder.append(Util.getNumberXml(beanLote.getSaldo()));
            builder.append("</SALDO>");
            builder.append("<FECHAFABRICACION>");
            builder.append(beanLote.getFechaFabricacion() != null ? UtilDate.getStrFecha(beanLote.getFechaFabricacion()) : null);
            builder.append("</FECHAFABRICACION>");
            builder.append("<FECHACADUCIDAD>");
            builder.append(beanLote.getFechaCaducidad() != null ? UtilDate.getStrFecha(beanLote.getFechaCaducidad()) : null);
            builder.append("</FECHACADUCIDAD>");
            builder.append("<IDLABORATORIO>");
            builder.append(beanLote.getIdLaboratorio());
            builder.append("</IDLABORATORIO>");
            builder.append("<IDUBICACION>");
            builder.append(beanLote.getIdUbicacion());
            builder.append("</IDUBICACION>");
            builder.append("<IDMOVIMIENTODEV>");
            builder.append(beanLote.getIdMovimientoDev());
            builder.append("</IDMOVIMIENTODEV>");
            builder.append("<EXPIRA>");
            builder.append(beanLote.isNoExpira() ? 'N' : 'S');
            builder.append("</EXPIRA>");
            builder.append("</LOTE>");
        }
        builder.append("</LOTES>");
        System.out.println(builder.toString());
        return builder.toString();
    }

}
